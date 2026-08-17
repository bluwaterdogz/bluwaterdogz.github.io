// AKfycbwStGXno5MnMpWiBItj4IpllhKhD0EQhBxL_rA4RYOwKcZNUcGqltGu-6W6DD_IKPyD
 
import { useEffect, useRef, useState } from "react";
import TOPICS from "./chameleon-topics.json";
import styles from "./chameleon.module.scss";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwStGXno5MnMpWiBItj4IpllhKhD0EQhBxL_rA4RYOwKcZNUcGqltGu-6W6DD_IKPyD/exec";

const NONE = "__NONE__";

const DEFAULT_SETTINGS = {
  topic: "Animals",
  chameleonCount: 1,
  allowZeroChameleons: false,

  scoring: {
    correctVote: 1,
    chameleonEscapes: 2,
    chameleonGuessesWord: 1,
    playersWhenChameleonGuesses: -1,
    abstain: 0,
    noneCorrect: 3,
    noneIncorrect: -2,
  },
};

const SCORE_FIELDS = [
  ["correctVote", "Player votes correctly"],
  ["chameleonEscapes", "Chameleon escapes"],
  ["chameleonGuessesWord", "Chameleon guesses word"],
  [
    "playersWhenChameleonGuesses",
    "Players when Chameleon guesses word",
  ],
  ["abstain", "Abstain"],
  ["noneCorrect", "Player votes no one correctly"],
  ["noneIncorrect", "Player votes no one incorrectly"],
];

// ============================================================
// LOCAL IDENTITY
// ============================================================

function createId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
}

function getPlayerId() {
  let id = localStorage.getItem(
    "chameleon-player-id"
  );

  if (!id) {
    id = createId();

    localStorage.setItem(
      "chameleon-player-id",
      id
    );
  }

  return id;
}

function getRoomToken(roomId: string) {
  const key =
    `chameleon-token:${roomId}`;

  let token =
    localStorage.getItem(key);

  if (!token) {
    token = createId();

    localStorage.setItem(
      key,
      token
    );
  }

  return token;
}

function createRoomCode() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    { length: 6 },
    () =>
      alphabet[
        Math.floor(
          Math.random() *
            alphabet.length
        )
      ]
  ).join("");
}

// ============================================================
// API
// ============================================================

async function apiPost(
  payload: Record<
    string,
    unknown
  >
) {
  const body =
    new URLSearchParams({
      payload:
        JSON.stringify(
          payload
        ),
    });

  await fetch(
    API_URL,
    {
      method: "POST",
      mode: "no-cors",
      body,
    }
  );
}

function apiGet(
  room: string,
  token: string
): Promise<any> {
  return new Promise(
    (resolve, reject) => {
      const callback =
        `__chameleon_${Date.now()}_${Math.random()
          .toString(36)
          .slice(2)}`;

      const script =
        document.createElement(
          "script"
        );

      const cleanup = () => {
        delete (
          window as any
        )[callback];

        script.remove();
      };

      (
        window as any
      )[callback] = (
        result: any
      ) => {
        cleanup();
        resolve(result);
      };

      script.onerror =
        () => {
          cleanup();

          reject(
            new Error(
              "Could not reach the game service."
            )
          );
        };

      const params =
        new URLSearchParams({
          room,
          token,
          callback,
          _: String(
            Date.now()
          ),
        });

      script.src =
        `${API_URL}?${params.toString()}`;

      document.body.appendChild(
        script
      );
    }
  );
}

function scoreText(
  value: number
) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

// ============================================================
// COMPONENT
// ============================================================

export default function Chameleon() {
  const playerId =
    useRef(
      getPlayerId()
    ).current;

  const [name, setName] =
    useState(
      () =>
        localStorage.getItem(
          "chameleon-name"
        ) || ""
    );

  const [
    roomInput,
    setRoomInput,
  ] = useState("");

  const [
    session,
    setSession,
  ] = useState<any>(null);

  const [
    game,
    setGame,
  ] = useState<any>(null);

  const [
    card,
    setCard,
  ] = useState<any>(null);

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const networkRef =
    useRef<any>(null);

  const gameRef =
    useRef<any>(null);

  gameRef.current = game;

  // ============================================================
  // POLLING / API ACTIONS
  // ============================================================

  useEffect(() => {
    if (!session) {
      return;
    }

    let stopped = false;

    async function refresh() {
      try {
        const result =
          await apiGet(
            session.roomId,
            session.token
          );

        if (stopped) {
          return;
        }

        if (!result.ok) {
          setError(
            result.error ||
              "Could not load game."
          );

          return;
        }

        setError("");

        setGame(
          result.game
        );

        setCard(
          result.me
        );
      } catch (
        err: any
      ) {
        if (!stopped) {
          setError(
            err?.message ||
              String(err)
          );
        }
      }
    }

    async function act(
      action: string,
      extra: Record<
        string,
        unknown
      > = {}
    ) {
      try {
        setLoading(true);

        await apiPost({
          action,
          room:
            session.roomId,
          token:
            session.token,
          ...extra,
        });

        await refresh();
      } catch (
        err: any
      ) {
        setError(
          err?.message ||
            String(err)
        );
      } finally {
        setLoading(false);
      }
    }

    networkRef.current = {
      refresh,

      updateSettings(
        patch: any
      ) {
        return act(
          "updateSettings",
          {
            patch,
          }
        );
      },

      startRound() {
        const current =
          gameRef.current;

        if (!current) {
          return;
        }

        const topic =
          current.settings
            .topic;

        const options =
          (
            TOPICS as Record<
              string,
              string[]
            >
          )[topic];

        if (!options) {
          setError(
            `Unknown topic: ${topic}`
          );

          return;
        }

        return act(
          "startRound",
          {
            options,
          }
        );
      },

      openVoting() {
        return act(
          "openVoting"
        );
      },

      submitVote(
        choice: string
      ) {
        return act(
          "vote",
          {
            choice,
          }
        );
      },

      submitGuess(
        word: string
      ) {
        return act(
          "guess",
          {
            word,
          }
        );
      },

      revealRound() {
        return act(
          "reveal"
        );
      },

      newRound() {
        return act(
          "newRound"
        );
      },

      restartGame() {
        return act(
          "restart"
        );
      },

      kickPlayer(
        targetPlayerId: string
      ) {
        return act(
          "kick",
          {
            playerId:
              targetPlayerId,
          }
        );
      },
    };

    refresh();

    const interval =
      window.setInterval(
        refresh,
        2500
      );

    return () => {
      stopped = true;

      clearInterval(
        interval
      );

      networkRef.current =
        null;
    };
  }, [session]);

  // ============================================================
  // JOIN / CREATE
  // ============================================================

  function validateName() {
    const clean =
      name
        .trim()
        .slice(0, 30);

    if (!clean) {
      setError(
        "Enter your name."
      );

      return null;
    }

    localStorage.setItem(
      "chameleon-name",
      clean
    );

    return clean;
  }

  async function createGame() {
    const cleanName =
      validateName();

    if (!cleanName) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const roomId =
        createRoomCode();

      const token =
        getRoomToken(
          roomId
        );

      await apiPost({
        action:
          "create",

        room:
          roomId,

        playerId,

        token,

        name:
          cleanName,

        settings:
          DEFAULT_SETTINGS,
      });

      setRoomInput(
        roomId
      );

      setSession({
        roomId,
        token,

        name:
          cleanName,

        isHost: true,
      });
    } catch (
      err: any
    ) {
      setError(
        err?.message ||
          String(err)
      );
    } finally {
      setLoading(false);
    }
  }

  async function joinGame() {
    const cleanName =
      validateName();

    if (!cleanName) {
      return;
    }

    const roomId =
      roomInput
        .trim()
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        );

    if (!roomId) {
      setError(
        "Enter a room code."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const token =
        getRoomToken(
          roomId
        );

      await apiPost({
        action:
          "join",

        room:
          roomId,

        playerId,

        token,

        name:
          cleanName,
      });

      setSession({
        roomId,
        token,

        name:
          cleanName,

        isHost: false,
      });
    } catch (
      err: any
    ) {
      setError(
        err?.message ||
          String(err)
      );
    } finally {
      setLoading(false);
    }
  }

  function leaveGame() {
    setSession(null);
    setGame(null);
    setCard(null);
    setError("");
  }

  // ============================================================
  // VIEW 1 — JOIN
  // ============================================================

  if (!session) {
    return (
      <div className={styles.chameleon}>
        <main
          className={`${styles.panel} ${styles["join-view"]}`}
        >
          <h1>
            Chameleon
          </h1>

          <label>
            Your name

            <input
              value={name}
              placeholder="Name"
              maxLength={30}
              onChange={e =>
                setName(
                  e.target
                    .value
                )
              }
            />
          </label>

          <button
            className={styles.primary}
            disabled={loading}
            onClick={
              createGame
            }
          >
            Create game
          </button>

          <div
            className={
              styles.divider
            }
          >
            or
          </div>

          <label>
            Room code

            <input
              value={
                roomInput
              }
              placeholder="ABC123"
              maxLength={12}
              onChange={e =>
                setRoomInput(
                  e.target.value
                    .toUpperCase()
                    .replace(
                      /[^A-Z0-9]/g,
                      ""
                    )
                )
              }
            />
          </label>

          <button
            disabled={loading}
            onClick={
              joinGame
            }
          >
            Join game
          </button>

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // WAITING FOR INITIAL STATE
  // ============================================================

  if (!game) {
    return (
      <div className={styles.chameleon}>
        <main className={styles.panel}>
          <small>
            ROOM
          </small>

          <h2>
            {session.roomId}
          </h2>

          <p
            className={
              styles.muted
            }
          >
            Loading game…
          </p>

          <button
            onClick={() =>
              networkRef.current?.refresh()
            }
          >
            Refresh
          </button>

          <button
            onClick={
              leaveGame
            }
          >
            Leave
          </button>

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  const hasVoted =
    Boolean(
      card?.hasVoted
    );

  // ============================================================
  // SHARED COMPONENT — PLAYERS
  // ============================================================

  function Players({
    kickable = false,
  }: {
    kickable?: boolean;
  }) {
    return (
      <section>
        <div
          className={
            styles[
              "section-heading"
            ]
          }
        >
          <h3>
            Players
          </h3>

          <span>
            {
              game.players
                .length
            }{" "}
            joined
          </span>
        </div>

        <div
          className={
            styles.players
          }
        >
          {game.players.map(
            (
              player: any
            ) => (
              <div
                className={
                  styles.player
                }
                key={
                  player.id
                }
              >
                <span
                  className={
                    styles.dot
                  }
                />

                <span
                  className={
                    styles[
                      "player-name"
                    ]
                  }
                >
                  {
                    player.name
                  }

                  {player.id ===
                    playerId &&
                    " (you)"}
                </span>

                <span
                  className={
                    styles[
                      "player-score"
                    ]
                  }
                >
                  {
                    player.score
                  }{" "}
                  pts
                </span>

                {player.isHost && (
                  <span
                    className={
                      styles.tag
                    }
                  >
                    host
                  </span>
                )}

                {kickable &&
                  session.isHost &&
                  !player.isHost && (
                    <button
                      className={
                        styles.kick
                      }
                      disabled={
                        loading
                      }
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
    );
  }

  // ============================================================
  // SHARED COMPONENT — SCORING RULES
  // ============================================================

  function ScoreRules() {
    return (
      <section>
        <h3>
          Points
        </h3>

        <div
          className={
            styles[
              "score-rules"
            ]
          }
        >
          {SCORE_FIELDS.map(
            ([
              key,
              label,
            ]) => (
              <div
                className={
                  styles[
                    "score-rule"
                  ]
                }
                key={key}
              >
                <span>
                  {label}
                </span>

                <strong>
                  {scoreText(
                    game
                      .settings
                      .scoring[
                      key
                    ]
                  )}
                </strong>
              </div>
            )
          )}
        </div>
      </section>
    );
  }

  // ============================================================
  // VIEW 2 — LOBBY
  // ============================================================

  if (
    game.phase ===
    "lobby"
  ) {
    return (
      <div className={styles.chameleon}>
        <main
          className={`${styles.panel} ${styles.wide}`}
        >
          <header
            className={
              styles[
                "game-header"
              ]
            }
          >
            <div>
              <small>
                ROOM
              </small>

              <h2>
                {
                  game.roomId
                }
              </h2>
            </div>

            <div>
              <button
                onClick={() =>
                  networkRef.current?.refresh()
                }
              >
                Refresh
              </button>

              <button
                onClick={
                  leaveGame
                }
              >
                Leave
              </button>
            </div>
          </header>

          <Players
            kickable
          />

          {session.isHost ? (
            <>
              <section
                className={
                  styles.settings
                }
              >
                <h3>
                  Game settings
                </h3>

                <label>
                  Topic

                  <select
                    value={
                      game
                        .settings
                        .topic
                    }
                    onChange={e =>
                      networkRef.current?.updateSettings(
                        {
                          topic:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                  >
                    {Object.keys(
                      TOPICS
                    ).map(
                      topic => (
                        <option
                          value={
                            topic
                          }
                          key={
                            topic
                          }
                        >
                          {
                            topic
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  Number of
                  chameleons

                  <input
                    type="number"
                    min={1}
                    max={Math.max(
                      1,
                      game.players
                        .length -
                        1
                    )}
                    value={
                      game
                        .settings
                        .chameleonCount
                    }
                    onChange={e =>
                      networkRef.current?.updateSettings(
                        {
                          chameleonCount:
                            Number(
                              e
                                .target
                                .value
                            ),
                        }
                      )
                    }
                  />
                </label>

                <label
                  className={
                    styles.checkbox
                  }
                >
                  <input
                    type="checkbox"
                    checked={
                      game
                        .settings
                        .allowZeroChameleons
                    }
                    onChange={e =>
                      networkRef.current?.updateSettings(
                        {
                          allowZeroChameleons:
                            e
                              .target
                              .checked,
                        }
                      )
                    }
                  />

                  Sometimes have
                  zero Chameleons
                </label>
              </section>

              <section>
                <h3>
                  Scoring
                </h3>

                <div
                  className={
                    styles[
                      "score-inputs"
                    ]
                  }
                >
                  {SCORE_FIELDS.map(
                    ([
                      key,
                      label,
                    ]) => (
                      <label
                        key={
                          key
                        }
                      >
                        <span>
                          {
                            label
                          }
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
                          onChange={e =>
                            networkRef.current?.updateSettings(
                              {
                                scoring:
                                  {
                                    [key]:
                                      Number(
                                        e
                                          .target
                                          .value
                                      ),
                                  },
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
                className={`${styles.primary} ${styles.big}`}
                disabled={
                  loading
                }
                onClick={() =>
                  networkRef.current?.startRound()
                }
              >
                Start game
              </button>
            </>
          ) : (
            <>
              <section
                className={
                  styles[
                    "topic-box"
                  ]
                }
              >
                <small>
                  CURRENT TOPIC
                </small>

                <h1>
                  {
                    game
                      .settings
                      .topic
                  }
                </h1>
              </section>

              <ScoreRules />
            </>
          )}

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // VIEW 3 — PLAYING
  // ============================================================

  if (
    game.phase ===
    "playing"
  ) {
    return (
      <div className={styles.chameleon}>
        <main
          className={`${styles.panel} ${styles.wide}`}
        >
          <header
            className={
              styles[
                "game-header"
              ]
            }
          >
            <div>
              <small>
                ROUND{" "}
                {
                  game.round
                }
              </small>

              <h2>
                {
                  game
                    .settings
                    .topic
                }
              </h2>
            </div>

            <button
              onClick={() =>
                networkRef.current?.refresh()
              }
            >
              Refresh
            </button>
          </header>

          {!card ? (
            <section
              className={
                styles[
                  "role-card"
                ]
              }
            >
              <h2>
                Loading your
                role…
              </h2>
            </section>
          ) : card.isChameleon ? (
            <section
              className={`${styles["role-card"]} ${styles["chameleon-card"]}`}
            >
              <small>
                YOUR ROLE
              </small>

              <h1>
                You are the
                Chameleon
              </h1>

              <p>
                Figure out the
                secret word
                without getting
                caught.
              </p>
            </section>
          ) : (
            <section
              className={`${styles["role-card"]} ${styles["word-card"]}`}
            >
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

            <div
              className={
                styles.options
              }
            >
              {(
                TOPICS as Record<
                  string,
                  string[]
                >
              )[
                game.settings
                  .topic
              ]?.map(
                option => (
                  <div
                    key={
                      option
                    }
                    className={
                      card &&
                      !card.isChameleon &&
                      card.word ===
                        option
                        ? `${styles.option} ${styles.selected}`
                        : styles.option
                    }
                  >
                    {
                      option
                    }
                  </div>
                )
              )}
            </div>
          </section>

          {session.isHost && (
            <button
              className={`${styles.primary} ${styles.big}`}
              disabled={
                loading
              }
              onClick={() =>
                networkRef.current?.openVoting()
              }
            >
              Vote
            </button>
          )}

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // VIEW 4 — VOTING
  // ============================================================

  if (
    game.phase ===
    "voting"
  ) {
    return (
      <div className={styles.chameleon}>
        <main
          className={`${styles.panel} ${styles.wide}`}
        >
          <header
            className={
              styles[
                "game-header"
              ]
            }
          >
            <div>
              <small>
                ROUND{" "}
                {
                  game.round
                }
              </small>

              <h2>
                Vote
              </h2>
            </div>

            <span>
              {
                game
                  .votedPlayerIds
                  .length
              }
              /
              {
                game.players
                  .length
              }{" "}
              voted
            </span>
          </header>

          <section>
            <h3>
              Who is the
              Chameleon?
            </h3>

            {hasVoted ? (
              <div
                className={
                  styles.submitted
                }
              >
                Vote submitted
              </div>
            ) : (
              <div
                className={
                  styles[
                    "vote-grid"
                  ]
                }
              >
                {game.players
                  .filter(
                    (
                      player: any
                    ) =>
                      player.id !==
                      playerId
                  )
                  .map(
                    (
                      player: any
                    ) => (
                      <button
                        key={
                          player.id
                        }
                        disabled={
                          loading
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
                  className={
                    styles.none
                  }
                  disabled={
                    loading
                  }
                  onClick={() =>
                    networkRef.current?.submitVote(
                      NONE
                    )
                  }
                >
                  {game.settings
                    .allowZeroChameleons
                    ? "No one"
                    : "No one / abstain"}
                </button>
              </div>
            )}
          </section>

          {card?.isChameleon && (
            <section
              className={
                styles[
                  "guess-box"
                ]
              }
            >
              <h3>
                Guess the secret
                word
              </h3>

              <p
                className={
                  styles.muted
                }
              >
                Your guess stays
                hidden until the
                reveal.
              </p>

              {card.guessSubmitted ? (
                <div
                  className={
                    styles.submitted
                  }
                >
                  Guess submitted
                </div>
              ) : (
                <div
                  className={
                    styles[
                      "guess-buttons"
                    ]
                  }
                >
                  {(
                    TOPICS as Record<
                      string,
                      string[]
                    >
                  )[
                    game.settings
                      .topic
                  ]?.map(
                    option => (
                      <button
                        key={
                          option
                        }
                        disabled={
                          loading
                        }
                        onClick={() =>
                          networkRef.current?.submitGuess(
                            option
                          )
                        }
                      >
                        {
                          option
                        }
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
              className={`${styles.primary} ${styles.big}`}
              disabled={
                loading
              }
              onClick={() =>
                networkRef.current?.revealRound()
              }
            >
              Reveal
            </button>
          )}

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // VIEW 5 — RESULTS
  // ============================================================

  if (
    game.phase ===
    "revealed"
  ) {
    const reveal =
      game.reveal;

    const chameleons =
      game.players.filter(
        (
          player: any
        ) =>
          reveal.chameleonIds.includes(
            player.id
          )
      );

    return (
      <div className={styles.chameleon}>
        <main
          className={`${styles.panel} ${styles.wide}`}
        >
          <header
            className={
              styles[
                "game-header"
              ]
            }
          >
            <div>
              <small>
                ROUND{" "}
                {
                  game.round
                }
              </small>

              <h2>
                Results
              </h2>
            </div>
          </header>

          <section
            className={
              styles[
                "result-hero"
              ]
            }
          >
            {chameleons.length ===
            0 ? (
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
                    ? "S"
                    : ""}
                </small>

                <h1>
                  {chameleons
                    .map(
                      (
                        player: any
                      ) =>
                        player.name
                    )
                    .join(
                      ", "
                    )}
                </h1>
              </>
            )}

            <p>
              The word was{" "}
              <strong>
                {
                  reveal.word
                }
              </strong>
            </p>
          </section>

          <section>
            <h3>
              Votes
            </h3>

            <div
              className={
                styles[
                  "results-list"
                ]
              }
            >
              {game.players.map(
                (
                  voter: any
                ) => {
                  const choice =
                    reveal.votes[
                      voter.id
                    ];

                  const target =
                    game.players.find(
                      (
                        player: any
                      ) =>
                        player.id ===
                        choice
                    );

                  return (
                    <div
                      className={
                        styles[
                          "result-row"
                        ]
                      }
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
                        →{" "}

                        {choice ===
                        NONE
                          ? "No one"
                          : target?.name ||
                            "No vote"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {chameleons.length >
            0 && (
            <section>
              <h3>
                Chameleon
                guesses
              </h3>

              <div
                className={
                  styles[
                    "results-list"
                  ]
                }
              >
                {chameleons.map(
                  (
                    player: any
                  ) => {
                    const guess =
                      reveal
                        .wordGuesses[
                        player.id
                      ];

                    const correct =
                      guess ===
                      reveal.word;

                    return (
                      <div
                        className={
                          styles[
                            "result-row"
                          ]
                        }
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
                            "No guess"}

                          {guess &&
                            (correct
                              ? " ✓"
                              : " ✕")}
                        </strong>
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          <section>
            <h3>
              Scores
            </h3>

            <div
              className={
                styles.scoreboard
              }
            >
              {[...game.players]
                .sort(
                  (
                    a: any,
                    b: any
                  ) =>
                    b.score -
                    a.score
                )
                .map(
                  (
                    player: any
                  ) => (
                    <div
                      className={
                        styles[
                          "scoreboard-row"
                        ]
                      }
                      key={
                        player.id
                      }
                    >
                      <strong>
                        {
                          player.name
                        }
                      </strong>

                      <span
                        className={
                          styles[
                            "round-score"
                          ]
                        }
                      >
                        {scoreText(
                          reveal
                            .roundScores[
                            player.id
                          ] || 0
                        )}{" "}
                        this round
                      </span>

                      <span
                        className={
                          styles[
                            "total-score"
                          ]
                        }
                      >
                        {
                          player.score
                        }{" "}
                        total
                      </span>
                    </div>
                  )
                )}
            </div>
          </section>

          {session.isHost && (
            <div
              className={
                styles[
                  "end-controls"
                ]
              }
            >
              <button
                className={`${styles.primary} ${styles.big}`}
                disabled={
                  loading
                }
                onClick={() =>
                  networkRef.current?.newRound()
                }
              >
                New round
              </button>

              <button
                disabled={
                  loading
                }
                onClick={() =>
                  networkRef.current?.restartGame()
                }
              >
                Restart game
                / reset scores
              </button>
            </div>
          )}

          {error && (
            <div
              className={
                styles.error
              }
            >
              {error}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // UNKNOWN STATE
  // ============================================================

  return (
    <div className={styles.chameleon}>
      <main className={styles.panel}>
        <h2>
          Unknown game state
        </h2>

        <p>
          {game.phase}
        </p>

        <button
          onClick={() =>
            networkRef.current?.refresh()
          }
        >
          Refresh
        </button>

        <button
          onClick={
            leaveGame
          }
        >
          Leave
        </button>

        {error && (
          <div
            className={
              styles.error
            }
          >
            {error}
          </div>
        )}
      </main>
    </div>
  );
}