import {useEffect, useRef, useState} from 'react'
import {joinRoom} from 'trystero'
import './chameleon.module.scss'
import TOPICS from './chameleon-topics.json'
const APP_ID = 'chameleon-party-game-v2'
const NONE = '__NONE__'
const ZERO_CHAMELEON_CHANCE = 0.25

const DEFAULT_SETTINGS = {
  topic: 'Animals',

  chameleonCount: 1,
  allowZeroChameleons: false,

  scoring: {
    correctVote: 1,
    chameleonEscapes: 2,
    chameleonGuessesWord: 1,
    playersWhenChameleonGuesses: -1,

    // Used when "0 chameleons" is NOT enabled.
    abstain: 0,

    // Used when "0 chameleons" IS enabled.
    noneCorrect: 3,
    noneIncorrect: -2
  }
}

const SCORE_FIELDS = [
  ['correctVote', 'Player votes for a chameleon'],
  ['chameleonEscapes', 'Chameleon escapes'],
  ['chameleonGuessesWord', 'Chameleon guesses the word'],
  [
    'playersWhenChameleonGuesses',
    'Other players when chameleon guesses word'
  ],
  ['abstain', 'Abstain / no one when zero is impossible'],
  ['noneCorrect', 'Votes no one correctly'],
  ['noneIncorrect', 'Votes no one incorrectly']
]

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function shuffled(items) {
  return [...items].sort(() => Math.random() - 0.5)
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getPlayerId() {
  let id = localStorage.getItem('chameleon-player-id')

  if (!id) {
    id = createId()
    localStorage.setItem('chameleon-player-id', id)
  }

  return id
}

function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  return Array.from(
    {length: 6},
    () => alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('')
}

function scoreText(value) {
  return value > 0 ? `+${value}` : String(value)
}

export default function Chameleon() {
  const playerId = useRef(getPlayerId()).current

  const [name, setName] = useState(
    () => localStorage.getItem('chameleon-name') || ''
  )

  const [roomInput, setRoomInput] = useState('')
  const [session, setSession] = useState(null)

  const [game, setGame] = useState(null)

  // Private state received only by this player.
  const [card, setCard] = useState(null)

  const [error, setError] = useState('')
  const [guessSubmitted, setGuessSubmitted] = useState(false)

  const networkRef = useRef(null)

  // ============================================================
  // NETWORK / AUTHORITATIVE HOST
  // ============================================================

  useEffect(() => {
    if (!session) return

    const {
      roomId,
      name: playerName,
      isHost
    } = session

const room = joinRoom(
  {
    appId: APP_ID,
    relayConfig: {
      redundancy: 5
    }
  },
  roomId,
  {
    onJoinError: details => {
      console.error('TRYSTERO JOIN ERROR', details)

      setError(
        `Connection failed: ${
          details?.error?.message ||
          details?.error ||
          'unknown error'
        }`
      )
    }
  }
)

    const action = room.makeAction('game')

    let secretWord = null
    let chameleonIds = []

    // playerId -> selected playerId | NONE
    let votes = {}

    // chameleon playerId -> guessed word
    let wordGuesses = {}

    const kickedIds = new Set()

    let hostState = isHost
      ? {
          roomId,

          phase: 'lobby',
          round: 0,

          settings: structuredClone(DEFAULT_SETTINGS),

          players: [
            {
              id: playerId,
              peerId: null,
              name: playerName,
              connected: true,
              isHost: true,
              score: 0
            }
          ],

          votedPlayerIds: [],

          reveal: null
        }
      : null

    // ------------------------------------------------------------
    // BASIC SEND
    // ------------------------------------------------------------

    function send(message, target) {
      const options = target
        ? {target}
        : undefined

      action
        .send(message, options)
        .catch(console.error)
    }

    // ------------------------------------------------------------
    // PUBLIC STATE
    //
    // Deliberately strips peer IDs and secret information.
    // ------------------------------------------------------------

    function makePublicState() {
      return {
        roomId: hostState.roomId,

        phase: hostState.phase,
        round: hostState.round,

        settings: hostState.settings,

        options:
          TOPICS[hostState.settings.topic],

        players: hostState.players.map(player => ({
          id: player.id,
          name: player.name,
          connected: player.connected,
          isHost: player.isHost,
          score: player.score
        })),

        votedPlayerIds:
          hostState.votedPlayerIds,

        reveal:
          hostState.reveal
      }
    }

    function publish(target) {
      if (!isHost) return

      const state =
        makePublicState()

      // Host won't receive its own broadcast.
      setGame(state)

      send(
        {
          type: 'STATE',
          state
        },
        target
      )
    }

    // ------------------------------------------------------------
    // PRIVATE CARD
    // ------------------------------------------------------------

    function makeCard(player) {
      const isChameleon =
        chameleonIds.includes(player.id)

      return {
        round: hostState.round,

        isChameleon,

        topic:
          hostState.settings.topic,

        options:
          TOPICS[hostState.settings.topic],

        // Never send the word to a chameleon.
        word:
          isChameleon
            ? null
            : secretWord,

        guessSubmitted:
          Boolean(wordGuesses[player.id])
      }
    }

    function sendCard(player) {
      const privateCard =
        makeCard(player)

      if (player.id === playerId) {
        setCard(privateCard)
        setGuessSubmitted(
          privateCard.guessSubmitted
        )
        return
      }

      if (!player.peerId) return

      send(
        {
          type: 'CARD',
          card: privateCard
        },
        player.peerId
      )
    }

    // ------------------------------------------------------------
    // JOIN
    // ------------------------------------------------------------

    function handleJoin(message, peerId) {
      const joiningId =
        String(message.playerId || '')

      const joiningName =
        String(message.name || '')
          .trim()
          .slice(0, 30)

      if (!joiningId || !joiningName) {
        return
      }

      if (kickedIds.has(joiningId)) {
        send(
          {
            type: 'KICK',
            message:
              'The host removed you from this game.'
          },
          peerId
        )

        return
      }

      let player =
        hostState.players.find(
          p => p.id === joiningId
        )

      // Don't allow brand-new players during a round.
      if (
        !player &&
        hostState.phase !== 'lobby'
      ) {
        send(
          {
            type: 'ERROR',
            message:
              'This round has already started.'
          },
          peerId
        )

        return
      }

      if (player) {
        player.peerId = peerId
        player.connected = true
        player.name = joiningName
      } else {
        player = {
          id: joiningId,
          peerId,
          name: joiningName,
          connected: true,
          isHost: false,
          score: 0
        }

        hostState.players.push(player)
      }

      publish()

      // Restore private state after a refresh.
      if (
        hostState.phase === 'playing' ||
        hostState.phase === 'voting'
      ) {
        sendCard(player)
      }
    }

    // ------------------------------------------------------------
    // SETTINGS
    // ------------------------------------------------------------

    function updateSettings(patch) {
      if (!isHost) return

      hostState.settings = {
        ...hostState.settings,
        ...patch,
        scoring: {
          ...hostState.settings.scoring,
          ...(patch.scoring || {})
        }
      }

      publish()
    }

    // ------------------------------------------------------------
    // START ROUND
    // ------------------------------------------------------------

    function startRound() {
      if (!isHost) return

      const connectedPlayers =
        hostState.players.filter(
          player => player.connected
        )

      if (connectedPlayers.length < 3) {
        setError(
          'You need at least 3 connected players.'
        )
        return
      }

      const requestedCount =
        Number(
          hostState.settings.chameleonCount
        )

      if (
        requestedCount < 1 ||
        requestedCount >= connectedPlayers.length
      ) {
        setError(
          `Choose between 1 and ${
            connectedPlayers.length - 1
          } chameleons.`
        )
        return
      }

      setError('')

      const topic =
        hostState.settings.topic

      secretWord =
        randomItem(TOPICS[topic])

      let actualChameleonCount =
        requestedCount

      if (
        hostState.settings.allowZeroChameleons &&
        Math.random() <
          ZERO_CHAMELEON_CHANCE
      ) {
        actualChameleonCount = 0
      }

      chameleonIds =
        shuffled(
          connectedPlayers.map(
            player => player.id
          )
        ).slice(
          0,
          actualChameleonCount
        )

      votes = {}
      wordGuesses = {}

      hostState.round += 1
      hostState.phase = 'playing'

      hostState.votedPlayerIds = []
      hostState.reveal = null

      setCard(null)
      setGuessSubmitted(false)

      publish()

      connectedPlayers.forEach(sendCard)
    }

    // ------------------------------------------------------------
    // OPEN VOTING
    // ------------------------------------------------------------

    function openVoting() {
      if (!isHost) return

      if (hostState.phase !== 'playing') {
        return
      }

      hostState.phase = 'voting'
      publish()
    }

    // ------------------------------------------------------------
    // VOTE
    // ------------------------------------------------------------

    function handleVote(voterId, choice) {
      if (
        !hostState ||
        hostState.phase !== 'voting'
      ) {
        return
      }

      if (votes[voterId] !== undefined) {
        return
      }

      const voter =
        hostState.players.find(
          player => player.id === voterId
        )

      if (!voter?.connected) return

      // No self-voting.
      if (choice === voterId) return

      const validChoice =
        choice === NONE ||
        hostState.players.some(
          player => player.id === choice
        )

      if (!validChoice) return

      votes[voterId] = choice

      hostState.votedPlayerIds =
        Object.keys(votes)

      publish()
    }

    function submitVote(choice) {
      if (isHost) {
        handleVote(
          playerId,
          choice
        )
        return
      }

      send({
        type: 'VOTE',
        playerId,
        choice
      })
    }

    // ------------------------------------------------------------
    // CHAMELEON WORD GUESS
    //
    // Submitted privately before reveal.
    // ------------------------------------------------------------

    function handleGuess(
      guessingPlayerId,
      word
    ) {
      if (
        hostState.phase !== 'voting'
      ) {
        return
      }

      if (
        !chameleonIds.includes(
          guessingPlayerId
        )
      ) {
        return
      }

      if (
        wordGuesses[
          guessingPlayerId
        ]
      ) {
        return
      }

      if (
        !TOPICS[
          hostState.settings.topic
        ].includes(word)
      ) {
        return
      }

      wordGuesses[
        guessingPlayerId
      ] = word

      const player =
        hostState.players.find(
          p =>
            p.id ===
            guessingPlayerId
        )

      if (player) {
        sendCard(player)
      }
    }

    function submitGuess(word) {
      if (
        !card?.isChameleon ||
        guessSubmitted
      ) {
        return
      }

      setGuessSubmitted(true)

      if (isHost) {
        handleGuess(
          playerId,
          word
        )
        return
      }

      send({
        type: 'GUESS',
        playerId,
        word
      })
    }

    // ------------------------------------------------------------
    // SCORE / REVEAL
    // ------------------------------------------------------------

    function revealRound() {
      if (
        !isHost ||
        hostState.phase !== 'voting'
      ) {
        return
      }

      const scoring =
        hostState.settings.scoring

      const roundScores = {}

      hostState.players.forEach(
        player => {
          roundScores[player.id] = 0
        }
      )

      // ----------------------------------------------------------
      // INDIVIDUAL VOTE SCORES
      // ----------------------------------------------------------

      hostState.players.forEach(
        player => {
          const vote =
            votes[player.id]

          // Didn't vote.
          if (vote === undefined) {
            return
          }

          if (vote === NONE) {
            if (
              hostState.settings
                .allowZeroChameleons
            ) {
              if (
                chameleonIds.length === 0
              ) {
                roundScores[player.id] +=
                  scoring.noneCorrect
              } else {
                roundScores[player.id] +=
                  scoring.noneIncorrect
              }
            } else {
              roundScores[player.id] +=
                scoring.abstain
            }

            return
          }

          if (
            chameleonIds.includes(vote)
          ) {
            roundScores[player.id] +=
              scoring.correctVote
          }
        }
      )

      // ----------------------------------------------------------
      // DETERMINE WHO THE GROUP CAUGHT
      //
      // Highest vote count wins.
      // Ties count as caught.
      // NONE participates in the tally.
      // ----------------------------------------------------------

      const voteCounts = {}

      Object.values(votes).forEach(
        choice => {
          voteCounts[choice] =
            (voteCounts[choice] || 0) + 1
        }
      )

      const highestVoteCount =
        Math.max(
          0,
          ...Object.values(voteCounts)
        )

      const caughtChameleonIds =
        chameleonIds.filter(
          id =>
            highestVoteCount > 0 &&
            voteCounts[id] ===
              highestVoteCount
        )

      // ----------------------------------------------------------
      // CHAMELEON ESCAPE SCORES
      // ----------------------------------------------------------

      chameleonIds.forEach(id => {
        if (
          !caughtChameleonIds.includes(id)
        ) {
          roundScores[id] +=
            scoring.chameleonEscapes
        }
      })

      // ----------------------------------------------------------
      // WORD-GUESS SCORES
      //
      // Only a caught chameleon gets the
      // traditional chance to score from
      // guessing the word.
      // ----------------------------------------------------------

      const correctGuessers = []

      caughtChameleonIds.forEach(
        id => {
          if (
            wordGuesses[id] ===
            secretWord
          ) {
            correctGuessers.push(id)

            roundScores[id] +=
              scoring.chameleonGuessesWord
          }
        }
      )

      // Each successful chameleon guess applies
      // the configured penalty once.
      correctGuessers.forEach(() => {
        hostState.players.forEach(
          player => {
            if (
              !chameleonIds.includes(
                player.id
              )
            ) {
              roundScores[player.id] +=
                scoring.playersWhenChameleonGuesses
            }
          }
        )
      })

      // ----------------------------------------------------------
      // UPDATE TOTAL SCORES
      // ----------------------------------------------------------

      hostState.players.forEach(
        player => {
          player.score +=
            roundScores[player.id] || 0
        }
      )

      hostState.phase = 'revealed'

      hostState.reveal = {
        word: secretWord,

        chameleonIds:
          [...chameleonIds],

        caughtChameleonIds,

        votes:
          {...votes},

        wordGuesses:
          {...wordGuesses},

        correctGuessers,

        roundScores
      }

      publish()
    }

    // ------------------------------------------------------------
    // NEW ROUND
    //
    // Preserve totals/settings.
    // ------------------------------------------------------------

    function newRound() {
      startRound()
    }

    // ------------------------------------------------------------
    // RESTART GAME
    //
    // Same players and settings.
    // Reset scores.
    // Return everyone to lobby.
    // ------------------------------------------------------------

    function restartGame() {
      if (!isHost) return

      secretWord = null
      chameleonIds = []
      votes = {}
      wordGuesses = {}

      hostState.phase = 'lobby'
      hostState.round = 0
      hostState.votedPlayerIds = []
      hostState.reveal = null

      hostState.players.forEach(
        player => {
          player.score = 0
        }
      )

      setCard(null)
      setGuessSubmitted(false)

      publish()
    }

    // ------------------------------------------------------------
    // KICK
    // ------------------------------------------------------------

    function kickPlayer(kickedId) {
      if (
        !isHost ||
        hostState.phase !== 'lobby' ||
        kickedId === playerId
      ) {
        return
      }

      const player =
        hostState.players.find(
          p => p.id === kickedId
        )

      if (!player) return

      kickedIds.add(kickedId)

      if (player.peerId) {
        send(
          {
            type: 'KICK',
            message:
              'The host removed you from this game.'
          },
          player.peerId
        )
      }

      hostState.players =
        hostState.players.filter(
          p => p.id !== kickedId
        )

      publish()
    }

    // ------------------------------------------------------------
    // INCOMING ACTIONS
    // ------------------------------------------------------------

    action.onMessage = (
      message,
      {peerId}
    ) => {
      if (
        !message ||
        typeof message !== 'object'
      ) {
        return
      }

      // HOST RECEIVES COMMANDS
      if (isHost) {
        switch (message.type) {
          case 'JOIN':
            handleJoin(
              message,
              peerId
            )
            break

          case 'REQUEST_STATE':
            publish(peerId)
            break

          case 'VOTE':
            handleVote(
              message.playerId,
              message.choice
            )
            break

          case 'GUESS':
            handleGuess(
              message.playerId,
              message.word
            )
            break

          default:
            break
        }

        return
      }

      // CLIENT RECEIVES HOST DATA
      switch (message.type) {
        case 'STATE':
          setGame(message.state)

          if (
            message.state.phase ===
              'lobby' ||
            message.state.phase ===
              'revealed'
          ) {
            if (
              message.state.phase ===
              'lobby'
            ) {
              setCard(null)
            }
          }

          break

        case 'CARD':
          setCard(message.card)
          setGuessSubmitted(
            Boolean(
              message.card
                .guessSubmitted
            )
          )
          break

        case 'ERROR':
          setError(
            message.message
          )
          break

        case 'KICK':
          setError(
            message.message
          )

          setGame(null)
          setCard(null)
          setSession(null)
          break

        default:
          break
      }
    }

    // ------------------------------------------------------------
    // PEER JOIN / LEAVE
    // ------------------------------------------------------------

    function announceJoin(target) {
      if (isHost) return

      send(
        {
          type: 'JOIN',
          playerId,
          name: playerName
        },
        target
      )
    }

    room.onPeerJoin = peerId => {
      console.log('PEER JOINED', peerId)
      console.log('CURRENT PEERS', room.getPeers())

      if (isHost) {
        publish(peerId)
      } else {
        announceJoin(peerId)
      }
    }

    room.onPeerLeave = peerId => {
      console.log('PEER LEFT', peerId)

      if (!isHost) return

      const player = hostState.players.find(
        p => p.peerId === peerId
      )

      if (!player) return

      player.peerId = null
      player.connected = false

      publish()
    }

    // ------------------------------------------------------------
    // EXPOSE HOST / CLIENT METHODS TO COMPONENT
    // ------------------------------------------------------------

    networkRef.current = {
      updateSettings,

      startRound,
      openVoting,

      submitVote,
      submitGuess,

      revealRound,

      newRound,
      restartGame,

      kickPlayer,

      refresh() {
        if (isHost) {
          publish()
        } else {
          send({
            type:
              'REQUEST_STATE'
          })

          announceJoin()
        }
      },

      leave() {
        room.leave()
      }
    }

    // ------------------------------------------------------------
    // INITIAL SYNC
    // ------------------------------------------------------------

    if (isHost) {
      publish()
    } else {
      // Helpful if discovery happens before
      // our callback is assigned.
      setTimeout(
        () => announceJoin(),
        400
      )

      setTimeout(
        () => announceJoin(),
        1200
      )
    }

    return () => {
      room.leave()
      networkRef.current = null
    }
  }, [
    session,
    playerId
  ])

  // ============================================================
  // SESSION
  // ============================================================

  function validateName() {
    const clean =
      name.trim().slice(0, 30)

    if (!clean) {
      setError(
        'Enter your name.'
      )
      return null
    }

    localStorage.setItem(
      'chameleon-name',
      clean
    )

    return clean
  }

  function createGame() {
    const cleanName =
      validateName()

    if (!cleanName) return

    const roomId =
      createRoomCode()

    setRoomInput(roomId)

    setError('')

    setSession({
      roomId,
      name: cleanName,
      isHost: true
    })
  }

  function joinGame() {
    const cleanName =
      validateName()

    if (!cleanName) return

    const roomId =
      roomInput
        .trim()
        .toUpperCase()

    if (!roomId) {
      setError(
        'Enter a room code.'
      )
      return
    }

    setError('')

    setSession({
      roomId,
      name: cleanName,
      isHost: false
    })
  }

  function leaveGame() {
    networkRef.current?.leave()

    setSession(null)
    setGame(null)
    setCard(null)
    setGuessSubmitted(false)
  }

  // ============================================================
  // VIEW 1: JOIN
  // ============================================================

  if (!session) {
    return (
      <div className="chameleon">
        <main className="panel join-view">
          <h1>Chameleon</h1>

          <label>
            Your name

            <input
              value={name}
              placeholder="Name"
              maxLength={30}
              onChange={event =>
                setName(
                  event.target.value
                )
              }
            />
          </label>

          <button
            className="primary"
            onClick={createGame}
          >
            Create game
          </button>

          <div className="divider">
            or
          </div>

          <label>
            Room code

            <input
              value={roomInput}
              placeholder="ABC123"
              maxLength={12}
              onChange={event =>
                setRoomInput(
                  event.target.value
                    .toUpperCase()
                    .replace(
                      /[^A-Z0-9]/g,
                      ''
                    )
                )
              }
            />
          </label>

          <button
            onClick={joinGame}
          >
            Join game
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </main>
      </div>
    )
  }

  // ============================================================
  // CONNECTING
  // ============================================================

  if (!game) {
    return (
      <div className="chameleon">
        <main className="panel">
          <h2>
            Room {session.roomId}
          </h2>

          <p className="muted">
            Finding the host…
          </p>

          <button
            onClick={() =>
              networkRef.current?.refresh()
            }
          >
            Refresh
          </button>

          <button
            onClick={leaveGame}
          >
            Leave
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </main>
      </div>
    )
  }

  const me =
    game.players.find(
      player =>
        player.id === playerId
    )

  const hasVoted =
    game.votedPlayerIds?.includes(
      playerId
    )

  // ============================================================
  // REUSABLE PIECES
  // ============================================================

  function Players({
    kickable = false
  }) {
    return (
      <section>
        <div className="section-heading">
          <h3>Players</h3>

          <span>
            {
              game.players.filter(
                player =>
                  player.connected
              ).length
            }{' '}
            connected
          </span>
        </div>

        <div className="players">
          {game.players.map(
            player => (
              <div
                className={`player ${
                  player.connected
                    ? ''
                    : 'offline'
                }`}
                key={player.id}
              >
                <span className="dot" />

                <span className="player-name">
                  {player.name}

                  {player.id ===
                    playerId &&
                    ' (you)'}
                </span>

                <span className="player-score">
                  {player.score} pts
                </span>

                {player.isHost && (
                  <span className="tag">
                    host
                  </span>
                )}

                {kickable &&
                  session.isHost &&
                  !player.isHost && (
                    <button
                      className="kick"
                      onClick={() =>
                        networkRef.current?.kickPlayer(
                          player.id
                        )
                      }
                    >
                      Kick
                    </button>
                  )}
              </div>
            )
          )}
        </div>
      </section>
    )
  }

  function ScoreRules() {
    return (
      <section>
        <h3>Points</h3>

        <div className="score-rules">
          {SCORE_FIELDS.map(
            ([key, label]) => (
              <div
                className="score-rule"
                key={key}
              >
                <span>
                  {label}
                </span>

                <strong>
                  {scoreText(
                    game.settings
                      .scoring[key]
                  )}
                </strong>
              </div>
            )
          )}
        </div>
      </section>
    )
  }

  // ============================================================
  // VIEW 2: LOBBY
  // ============================================================

  if (game.phase === 'lobby') {
    return (
      <div className="chameleon">
        <main className="panel wide">
          <header className="game-header">
            <div>
              <small>ROOM</small>

              <h2>
                {game.roomId}
              </h2>
            </div>

            <button
              onClick={leaveGame}
            >
              Leave
            </button>
          </header>

          <Players kickable />

          {session.isHost ? (
            <>
              <section className="settings">
                <h3>Game settings</h3>

                <label>
                  Topic

                  <select
                    value={
                      game.settings
                        .topic
                    }
                    onChange={
                      event =>
                        networkRef.current?.updateSettings(
                          {
                            topic:
                              event
                                .target
                                .value
                          }
                        )
                    }
                  >
                    {Object.keys(
                      TOPICS
                    ).map(topic => (
                      <option
                        key={topic}
                        value={topic}
                      >
                        {topic}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Number of
                  chameleons

                  <input
                    type="number"
                    min="1"
                    max={Math.max(
                      1,
                      game.players
                        .length - 1
                    )}
                    value={
                      game.settings
                        .chameleonCount
                    }
                    onChange={
                      event =>
                        networkRef.current?.updateSettings(
                          {
                            chameleonCount:
                              Number(
                                event
                                  .target
                                  .value
                              )
                          }
                        )
                    }
                  />
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={
                      game.settings
                        .allowZeroChameleons
                    }
                    onChange={
                      event =>
                        networkRef.current?.updateSettings(
                          {
                            allowZeroChameleons:
                              event
                                .target
                                .checked
                          }
                        )
                    }
                  />

                  Sometimes have
                  zero chameleons
                </label>
              </section>

              <section>
                <h3>
                  Scoring
                </h3>

                <div className="score-inputs">
                  {SCORE_FIELDS.map(
                    ([
                      key,
                      label
                    ]) => (
                      <label
                        key={key}
                      >
                        <span>
                          {label}
                        </span>

                        <input
                          type="number"
                          value={
                            game
                              .settings
                              .scoring[
                              key
                            ]
                          }
                          onChange={
                            event =>
                              networkRef.current?.updateSettings(
                                {
                                  scoring:
                                    {
                                      [key]:
                                        Number(
                                          event
                                            .target
                                            .value
                                        )
                                    }
                                }
                              )
                          }
                        />
                      </label>
                    )
                  )}
                </div>
              </section>

              <button
                className="primary big"
                onClick={() =>
                  networkRef.current?.startRound()
                }
              >
                Start game
              </button>
            </>
          ) : (
            <>
              <section className="topic-box">
                <small>
                  CURRENT TOPIC
                </small>

                <h1>
                  {
                    game.settings
                      .topic
                  }
                </h1>
              </section>

              <ScoreRules />

              <button
                onClick={() =>
                  networkRef.current?.refresh()
                }
              >
                Refresh state
              </button>
            </>
          )}

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </main>
      </div>
    )
  }

  // ============================================================
  // VIEW 3: WORD / ROLE
  // ============================================================

  if (game.phase === 'playing') {
    return (
      <div className="chameleon">
        <main className="panel wide">
          <header className="game-header">
            <div>
              <small>
                ROUND {game.round}
              </small>

              <h2>
                {
                  game.settings
                    .topic
                }
              </h2>
            </div>
          </header>

          {!card ? (
            <section className="role-card">
              <h2>
                Receiving your
                card…
              </h2>
            </section>
          ) : card.isChameleon ? (
            <section className="role-card chameleon-card">
              <small>
                YOUR ROLE
              </small>

              <h1>
                You are the
                Chameleon
              </h1>

              <p>
                Try to figure out
                the secret word.
              </p>
            </section>
          ) : (
            <section className="role-card word-card">
              <small>
                SECRET WORD
              </small>

              <h1>
                {card.word}
              </h1>
            </section>
          )}

          <section>
            <h3>
              Possible words
            </h3>

            <div className="options">
              {game.options.map(
                option => (
                  <div
                    key={option}
                    className={`option ${
                      card &&
                      !card.isChameleon &&
                      card.word ===
                        option
                        ? 'selected'
                        : ''
                    }`}
                  >
                    {option}
                  </div>
                )
              )}
            </div>
          </section>

          {session.isHost && (
            <button
              className="primary big"
              onClick={() =>
                networkRef.current?.openVoting()
              }
            >
              Vote
            </button>
          )}
        </main>
      </div>
    )
  }

  // ============================================================
  // VIEW 4: VOTING
  // ============================================================

  if (game.phase === 'voting') {
    return (
      <div className="chameleon">
        <main className="panel wide">
          <header className="game-header">
            <div>
              <small>
                ROUND {game.round}
              </small>

              <h2>
                Vote
              </h2>
            </div>

            <span>
              {
                game.votedPlayerIds
                  .length
              }
              /
              {
                game.players.filter(
                  player =>
                    player.connected
                ).length
              }{' '}
              voted
            </span>
          </header>

          <section>
            <h3>
              Who is the
              Chameleon?
            </h3>

            {hasVoted ? (
              <div className="submitted">
                Vote submitted
              </div>
            ) : (
              <div className="vote-grid">
                {game.players
                  .filter(
                    player =>
                      player.id !==
                        playerId &&
                      player.connected
                  )
                  .map(
                    player => (
                      <button
                        key={
                          player.id
                        }
                        onClick={() =>
                          networkRef.current?.submitVote(
                            player.id
                          )
                        }
                      >
                        {
                          player.name
                        }
                      </button>
                    )
                  )}

                <button
                  className="none"
                  onClick={() =>
                    networkRef.current?.submitVote(
                      NONE
                    )
                  }
                >
                  {game.settings
                    .allowZeroChameleons
                    ? 'No one'
                    : 'No one / abstain'}
                </button>
              </div>
            )}
          </section>

          {card?.isChameleon && (
            <section className="guess-box">
              <h3>
                Guess the secret
                word
              </h3>

              <p className="muted">
                This remains
                private until
                reveal.
              </p>

              {guessSubmitted ? (
                <div className="submitted">
                  Guess submitted
                </div>
              ) : (
                <div className="guess-buttons">
                  {game.options.map(
                    option => (
                      <button
                        key={option}
                        onClick={() =>
                          networkRef.current?.submitGuess(
                            option
                          )
                        }
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
              )}
            </section>
          )}

          <Players />

          {session.isHost && (
            <button
              className="primary big"
              onClick={() =>
                networkRef.current?.revealRound()
              }
            >
              Reveal
            </button>
          )}
        </main>
      </div>
    )
  }

  // ============================================================
  // VIEW 5: REVEAL / RESULTS
  // ============================================================

  const reveal =
    game.reveal

  const chameleons =
    game.players.filter(
      player =>
        reveal.chameleonIds.includes(
          player.id
        )
    )

  return (
    <div className="chameleon">
      <main className="panel wide">
        <header className="game-header">
          <div>
            <small>
              ROUND {game.round}
            </small>

            <h2>Results</h2>
          </div>
        </header>

        <section className="result-hero">
          {chameleons.length === 0 ? (
            <>
              <small>
                THE TWIST
              </small>

              <h1>
                There was no
                Chameleon
              </h1>
            </>
          ) : (
            <>
              <small>
                CHAMELEON
                {chameleons.length >
                1
                  ? 'S'
                  : ''}
              </small>

              <h1>
                {chameleons
                  .map(
                    player =>
                      player.name
                  )
                  .join(', ')}
              </h1>
            </>
          )}

          <p>
            The word was{' '}
            <strong>
              {reveal.word}
            </strong>
          </p>
        </section>

        <section>
          <h3>Votes</h3>

          <div className="results-list">
            {game.players.map(
              voter => {
                const choice =
                  reveal.votes[
                    voter.id
                  ]

                const target =
                  game.players.find(
                    player =>
                      player.id ===
                      choice
                  )

                return (
                  <div
                    className="result-row"
                    key={
                      voter.id
                    }
                  >
                    <span>
                      {
                        voter.name
                      }
                    </span>

                    <span>
                      →

                      {' '}

                      {choice ===
                      NONE
                        ? 'No one'
                        : target
                            ?.name ||
                          'No vote'}
                    </span>
                  </div>
                )
              }
            )}
          </div>
        </section>

        {chameleons.length >
          0 && (
          <section>
            <h3>
              Chameleon guesses
            </h3>

            <div className="results-list">
              {chameleons.map(
                player => {
                  const guess =
                    reveal
                      .wordGuesses[
                      player.id
                    ]

                  const correct =
                    guess ===
                    reveal.word

                  return (
                    <div
                      className="result-row"
                      key={
                        player.id
                      }
                    >
                      <span>
                        {
                          player.name
                        }
                      </span>

                      <strong>
                        {guess ||
                          'No guess'}

                        {guess &&
                          (correct
                            ? ' ✓'
                            : ' ✕')}
                      </strong>
                    </div>
                  )
                }
              )}
            </div>
          </section>
        )}

        <section>
          <h3>Scores</h3>

          <div className="scoreboard">
            {[...game.players]
              .sort(
                (a, b) =>
                  b.score -
                  a.score
              )
              .map(player => (
                <div
                  className="scoreboard-row"
                  key={
                    player.id
                  }
                >
                  <strong>
                    {
                      player.name
                    }
                  </strong>

                  <span className="round-score">
                    {scoreText(
                      reveal
                        .roundScores[
                        player.id
                      ] || 0
                    )}{' '}
                    this round
                  </span>

                  <span className="total-score">
                    {player.score}{' '}
                    total
                  </span>
                </div>
              ))}
          </div>
        </section>

        {session.isHost && (
          <div className="end-controls">
            <button
              className="primary big"
              onClick={() =>
                networkRef.current?.newRound()
              }
            >
              New round
            </button>

            <button
              onClick={() =>
                networkRef.current?.restartGame()
              }
            >
              Restart game
              (reset scores)
            </button>
          </div>
        )}
      </main>
    </div>
  )
}