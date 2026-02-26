import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./thai_flashcard_app.module.scss";

const STORAGE_KEY = "thai-flashcards-v3";
const CUSTOM_SELECTION_KEY = "thai-flashcards-custom-selection-v1";

const THAI_ITEMS = [
  { id: "ก", type: "consonant", name: "ko kai", sound: "g / k", roman: "g/k", example: "ไก่" },
  { id: "า", type: "vowel", name: "sara aa", sound: "aa", roman: "aa", example: "มา" },
  { id: "น", type: "consonant", name: "no nu", sound: "n", roman: "n", example: "น้ำ" },
  { id: "อ", type: "consonant", name: "o ang", sound: "silent carrier / ɔ", roman: "o / carrier", example: "ออก" },
  { id: "ร", type: "consonant", name: "ro rua", sound: "r", roman: "r", example: "รัก" },
  { id: "ม", type: "consonant", name: "mo ma", sound: "m", roman: "m", example: "มา" },
  { id: "i-vowel", char: "ิ", type: "vowel", name: "sara i", sound: "i (short)", roman: "i", example: "กิน" },
  { id: "เ", type: "vowel", name: "sara e", sound: "e", roman: "e", example: "เม" },
  { id: "ย", type: "consonant", name: "yo yak", sound: "y", roman: "y", example: "ยา" },
  { id: "ท", type: "consonant", name: "tho thahan", sound: "t / th", roman: "t/th", example: "ไทย" },

  { id: "ด", type: "consonant", name: "do dek", sound: "d", roman: "d", example: "ดี" },
  { id: "ส", type: "consonant", name: "so sua", sound: "s", roman: "s", example: "สวย" },
  { id: "ต", type: "consonant", name: "to tao", sound: "t", roman: "t", example: "โต" },
  { id: "ล", type: "consonant", name: "lo ling", sound: "l", roman: "l", example: "ลา" },
  { id: "ว", type: "consonant", name: "wo waen", sound: "w", roman: "w", example: "วาน" },
  { id: "ค", type: "consonant", name: "kho khwai", sound: "kh", roman: "kh", example: "คน" },
  { id: "ห", type: "consonant", name: "ho hip", sound: "h", roman: "h", example: "หา" },
  { id: "ง", type: "consonant", name: "ngo ngu", sound: "ng", roman: "ng", example: "งาน" },
  { id: "bamai", char: "ไ", type: "vowel", name: "sara ai mai malai", sound: "ai", roman: "ai", example: "ไทย" },
  { id: "mai-ek", char: "่", type: "tone", name: "mai ek", sound: "tone mark", roman: "tone mark", example: "ก่า" },

  { id: "p-vowel", char: "ี", type: "vowel", name: "sara ii", sound: "ii (long)", roman: "ii", example: "มี" },
  { id: "u-vowel", char: "ุ", type: "vowel", name: "sara u", sound: "u (short)", roman: "u", example: "สุข" },
  { id: "uu-vowel", char: "ู", type: "vowel", name: "sara uu", sound: "uu (long)", roman: "uu", example: "ดู" },
  { id: "p", char: "ป", type: "consonant", name: "po pla", sound: "p", roman: "p", example: "ปลา" },
  { id: "b", char: "บ", type: "consonant", name: "bo baimai", sound: "b", roman: "b", example: "บ้าน" },
  { id: "ch", char: "ช", type: "consonant", name: "cho chang", sound: "ch", roman: "ch", example: "ชา" },
  { id: "ph", char: "พ", type: "consonant", name: "pho phan", sound: "ph", roman: "ph", example: "พูด" },
  { id: "j", char: "จ", type: "consonant", name: "cho chan", sound: "j / ch", roman: "j/ch", example: "ใจ" },
  { id: "mai-tho", char: "้", type: "tone", name: "mai tho", sound: "tone mark", roman: "tone mark", example: "ก้า" },
  { id: "sara-o", char: "โ", type: "vowel", name: "sara o", sound: "o", roman: "o", example: "โต" },

  { id: "mai-tri", char: "๊", type: "tone", name: "mai tri", sound: "tone mark", roman: "tone mark", example: "ก๊" },
  { id: "mai-chattawa", char: "๋", type: "tone", name: "mai chattawa", sound: "tone mark", roman: "tone mark", example: "ก๋" },
  { id: "mai-han-akat", char: "ั", type: "vowel", name: "mai han-akat", sound: "a (short marker)", roman: "a", example: "กัน" },
  { id: "sara-a", char: "ะ", type: "vowel", name: "sara a", sound: "a (short)", roman: "a", example: "จะ" },
  { id: "sara-ue", char: "ึ", type: "vowel", name: "sara ue", sound: "ue (short)", roman: "ue", example: "ถึง" },
  { id: "sara-uee", char: "ื", type: "vowel", name: "sara uee", sound: "uee (long)", roman: "uee", example: "มือ" },
  { id: "sara-oe", char: "เ-อ", type: "vowel", name: "sara oe", sound: "oe", roman: "oe", example: "เจอ" },
  { id: "sara-ae", char: "แ", type: "vowel", name: "sara ae", sound: "ae", roman: "ae", example: "แม่" },
  { id: "sara-am", char: "ำ", type: "vowel", name: "sara am", sound: "am", roman: "am", example: "ทำ" },
  { id: "mai-tai-khu", char: "็", type: "sign", name: "mai tai khu", sound: "shortening mark", roman: "mark", example: "ก็" },

  { id: "f", char: "ฟ", type: "consonant", name: "fo fan", sound: "f", roman: "f", example: "แฟน" },
  { id: "h2", char: "ฮ", type: "consonant", name: "ho nokhuk", sound: "h", roman: "h", example: "ฮา" },
  { id: "kh2", char: "ข", type: "consonant", name: "kho khai", sound: "kh", roman: "kh", example: "ขาย" },
  { id: "th2", char: "ธ", type: "consonant", name: "tho thong", sound: "th/t", roman: "th/t", example: "ธง" },
  { id: "n2", char: "ณ", type: "consonant", name: "no nen", sound: "n", roman: "n", example: "คุณ" },
  { id: "s2", char: "ศ", type: "consonant", name: "so sala", sound: "s", roman: "s", example: "ศึกษา" },
  { id: "s3", char: "ษ", type: "consonant", name: "so ruesi", sound: "s", roman: "s", example: "ภาษา" },
  { id: "th3", char: "ถ", type: "consonant", name: "tho thung", sound: "th", roman: "th", example: "ถนน" },
  { id: "ph2", char: "ภ", type: "consonant", name: "pho samphao", sound: "ph", roman: "ph", example: "ภาษา" },
  { id: "rue", char: "ฤ", type: "letter", name: "rue", sound: "rue/ri", roman: "rue", example: "ฤดู" }
];

function chunkIntoGroups(items, size) {
  var groups = [];
  for (var i = 0; i < items.length; i += size) groups.push(items.slice(i, i + size));
  return groups;
}

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch (e) { return fallback; }
}

function cx() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(" ");
}

function App() {
  var groups = useMemo(function () { return chunkIntoGroups(THAI_ITEMS, 10); }, []);
  var _a = useState("study"), activeTab = _a[0], setActiveTab = _a[1];
  var _b = useState([0]), selectedGroups = _b[0], setSelectedGroups = _b[1];
  var _c = useState(function () {
    if (typeof window === "undefined") return THAI_ITEMS.slice(0, 10).map(function (i) { return i.id; });
    try {
      var raw = window.localStorage.getItem(CUSTOM_SELECTION_KEY);
      var parsed = safeParse(raw || "", []);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) {}
    return THAI_ITEMS.slice(0, 10).map(function (i) { return i.id; });
  }), customSelectedIds = _c[0], setCustomSelectedIds = _c[1];
  var _d = useState(function () {
    if (typeof window === "undefined") return [];
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var data = safeParse(raw || "", { memorized: [] });
      return Array.isArray(data.memorized) ? data.memorized : [];
    } catch (e) {
      return [];
    }
  }), memorizedIds = _d[0], setMemorizedIds = _d[1];
  var _e = useState([]), queue = _e[0], setQueue = _e[1];
  var _f = useState(false), flipped = _f[0], setFlipped = _f[1];
  var _g = useState(false), showMemorized = _g[0], setShowMemorized = _g[1];
  var _h = useState(false), autoplaySound = _h[0], setAutoplaySound = _h[1];
  var allowAutoSpeakRef = useRef(false);
  var utterRef = useRef(null);

  var memorizedSet = useMemo(function () { return new Set(memorizedIds); }, [memorizedIds]);
  var customSelectedSet = useMemo(function () { return new Set(customSelectedIds); }, [customSelectedIds]);

  var groupedSelectedItems = useMemo(function () {
    var selected = [];
    selectedGroups.forEach(function (g) { selected = selected.concat(groups[g] || []); });
    return selected;
  }, [selectedGroups, groups]);

  var baseSelectionItems = useMemo(function () {
    if (activeTab === "custom") {
      return THAI_ITEMS.filter(function (item) { return customSelectedSet.has(item.id); });
    }
    return groupedSelectedItems;
  }, [activeTab, customSelectedSet, groupedSelectedItems]);

  var activeItems = useMemo(function () {
    if (showMemorized) return baseSelectionItems;
    return baseSelectionItems.filter(function (item) { return !memorizedSet.has(item.id); });
  }, [baseSelectionItems, showMemorized, memorizedSet]);

  useEffect(function () {
    setQueue(activeItems.slice());
    setFlipped(false);
  }, [activeItems]);

  useEffect(function () {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ memorized: memorizedIds })); } catch (e) {}
  }, [memorizedIds]);

  useEffect(function () {
    if (typeof window === "undefined") return;
    try { window.localStorage.setItem(CUSTOM_SELECTION_KEY, JSON.stringify(customSelectedIds)); } catch (e) {}
  }, [customSelectedIds]);

  var current = queue.length ? queue[0] : null;

  function getChar(item) { return item ? (item.char || item.id || "") : ""; }

  function speak(text, fallbackEnglish) {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text || fallbackEnglish || "");
      utter.lang = "th-TH";
      utter.rate = 0.85;
      utter.pitch = 1;
      utterRef.current = utter;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }

  function rotateQueue() {
    // user explicitly advanced the deck
    allowAutoSpeakRef.current = true;
    setQueue(function (prev) {
      if (prev.length <= 1) return prev;
      var copy = prev.slice();
      var first = copy.shift();
      copy.push(first);
      return copy;
    });
    setFlipped(false);
  }

  function handleCardClick() {
    if (!current) return;
    setFlipped(function (v) { return !v; });
    var char = getChar(current);
    speak(char.length <= 2 ? char : current.name, current.sound);
  }

  function markMemorized() {
    // user explicitly advanced the deck
    allowAutoSpeakRef.current = true;
    if (!current) return;
    setMemorizedIds(function (prev) { return prev.indexOf(current.id) !== -1 ? prev : prev.concat(current.id); });
    setQueue(function (prev) { return prev.length ? prev.slice(1) : prev; });
    setFlipped(false);
  }

  function resetMemorizedForCurrentSelection() {
    var idsToReset = baseSelectionItems.map(function (item) { return item.id; });
    setMemorizedIds(function (prev) {
      return prev.filter(function (id) { return idsToReset.indexOf(id) === -1; });
    });
  }

  function toggleGroup(idx) {
    // changing selection should NOT trigger auto-speak
    allowAutoSpeakRef.current = false;
    setSelectedGroups(function (prev) {
      var has = prev.indexOf(idx) !== -1;
      if (has) {
        var next = prev.filter(function (g) { return g !== idx; });
        return next.length ? next : [0];
      }
      return prev.concat(idx).sort(function (a, b) { return a - b; });
    });
  }

  function toggleCustomItem(id) {
    // changing selection should NOT trigger auto-speak
    allowAutoSpeakRef.current = false;
    setCustomSelectedIds(function (prev) {
      var has = prev.indexOf(id) !== -1;
      if (has) {
        if (prev.length === 1) return prev;
        return prev.filter(function (x) { return x !== id; });
      }
      return prev.concat(id);
    });
  }

  function selectAllCustom() {
    allowAutoSpeakRef.current = false;
    setCustomSelectedIds(THAI_ITEMS.map(function (i) { return i.id; }));
  }
  function clearCustomToTop10() {
    allowAutoSpeakRef.current = false;
    setCustomSelectedIds(THAI_ITEMS.slice(0, 10).map(function (i) { return i.id; }));
  }

  var selectedCount = baseSelectionItems.length;
  var memorizedInSelection = baseSelectionItems.filter(function (item) { return memorizedSet.has(item.id); }).length;
  var remaining = activeItems.length;

  useEffect(function () {
    // Only auto-speak when enabled AND when the new card came from a study action (next/memorized/requeue),
    // not from changing selections (groups/custom checkboxes).
    if (!current) return;
    if (!autoplaySound) return;
    if (!allowAutoSpeakRef.current) return;
    allowAutoSpeakRef.current = false;
    speak(getChar(current), current.sound);
  }, [current && current.id, autoplaySound]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Thai Letter Flashcards</h1>
            <p className={styles.subtitle}>Tap card to flip + hear sound. ✓ memorizes, ✕ requeues.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}><div className={styles.statLabel}>Selected</div><div className={styles.statValue}>{selectedCount}</div></div>
            <div className={styles.statCard}><div className={styles.statLabel}>Memorized</div><div className={styles.statValue}>{memorizedInSelection}</div></div>
            <div className={styles.statCard}><div className={styles.statLabel}>Queue</div><div className={styles.statValue}>{remaining}</div></div>
          </div>

          <div className={styles.tabContainer}>
            <button
              onClick={function () { setActiveTab("study"); }}
              className={cx(styles.tabButton, activeTab === "study" ? styles.tabButtonActive : "")}
            >
              Study
            </button>
            <button
              onClick={function () { setActiveTab("custom"); }}
              className={cx(styles.tabButton, activeTab === "custom" ? styles.tabButtonActive : "")}
            >
              Custom List
            </button>
          </div>
        </header>

        {activeTab === "study" ? (
          <>
            <section className={styles.panel}>
              <div className={styles.sectionHeading}>Group selection (by commonness, sets of 10)</div>
              <div className={styles.groupButtonRow}>
                {groups.map(function (group, idx) {
                  var start = idx * 10 + 1;
                  var end = idx * 10 + group.length;
                  var selected = selectedGroups.indexOf(idx) !== -1;
                  return (
                    <button
                      key={idx}
                      onClick={function () { toggleGroup(idx); }}
                      className={cx(styles.groupButton, selected ? styles.groupButtonActive : "")}
                    >
                      {idx + 1} ({start}-{end})
                    </button>
                  );
                })}
              </div>
              <div className={styles.controlsGrid}>
                <button onClick={function () { setSelectedGroups(groups.map(function (_, i) { return i; })); }} className={styles.controlButton}>Select all groups</button>
                <button onClick={function () { setSelectedGroups([0]); }} className={styles.controlButton}>Top 10 only</button>
                <label className={cx(styles.controlButton, styles.checkControl)}>
                  <input type="checkbox" checked={showMemorized} onChange={function (e) { setShowMemorized(e.target.checked); }} /> Include memorized
                </label>
                <button
                  onClick={function () { setAutoplaySound(!autoplaySound); }}
                  className={cx(styles.controlButton, autoplaySound ? styles.controlButtonActive : "")}
                >
                  Auto-speak new card: {autoplaySound ? "On" : "Off"}
                </button>
                <button onClick={resetMemorizedForCurrentSelection} className={cx(styles.controlButton, styles.warningButton)}>Reset memorized (current)</button>
                <button onClick={function () { setMemorizedIds([]); }} className={cx(styles.controlButton, styles.dangerButton)}>Clear all memorized</button>
              </div>
            </section>

            <section className={styles.studyLayout}>
              <div className={styles.cardPanel}>
                {!current ? (
                  <div className={styles.emptyQueue}>
                    <div>
                      <div className={styles.emptyTitle}>No cards in queue 🎉</div>
                      <p className={styles.emptyCopy}>Try switching groups, turning on “Include memorized,” or using Custom List.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <button onClick={handleCardClick} className={styles.flashcardButton} aria-label="Flip flashcard and play sound">
                      <div className={styles.flashcard}>
                        {!flipped ? (
                          <div className={styles.cardFront}>
                            <div className={styles.cardChar}>{getChar(current)}</div>
                            <div className={styles.cardHint}>Tap to hear + flip</div>
                          </div>
                        ) : (
                          <div className={styles.cardBack}>
                            <div className={styles.cardBackChar}>{getChar(current)}</div>
                            <div className={styles.cardSound}>{current.sound}</div>
                            <div className={styles.cardName}>{current.name}</div>
                            <div className={styles.cardPronunciation}>Pronunciation: <b>{current.roman}</b></div>
                            <div className={styles.cardMeta}>Example: {current.example}</div>
                            <div className={styles.cardType}>{current.type}</div>
                          </div>
                        )}
                      </div>
                    </button>

                    <div className={styles.actionGrid}>
                      <button onClick={rotateQueue} className={cx(styles.actionButton, styles.requeueButton)}>✕ Requeue</button>
                      <button onClick={markMemorized} className={cx(styles.actionButton, styles.memorizeButton)}>✓ Memorized</button>
                      <button onClick={rotateQueue} className={styles.actionButton}>Next ↻</button>
                      <button onClick={function () { if (current) speak(getChar(current), current.sound); }} className={styles.actionButton}>🔊 Speak</button>
                    </div>
                  </>
                )}
              </div>

            </section>
          </>
        ) : (
          <section className={styles.panel}>
            <div className={styles.customHeader}>
              <div>
                <h2 className={styles.customTitle}>Custom letter picker</h2>
                <p className={styles.customCopy}>Check only the letters/signs you want included in a run. No sounds will play while you’re selecting audio only plays when you tap 🔊 or the flashcard (or if you toggle Auto-speak on).</p>
              </div>
              <div className={styles.customActions}>
                <button onClick={selectAllCustom} className={styles.controlButton}>Select all</button>
                <button onClick={clearCustomToTop10} className={styles.controlButton}>Top 10 preset</button>
              </div>
            </div>

            <div className={styles.customControlsGrid}>
              <label className={cx(styles.controlButton, styles.checkControl)}>
                <input type="checkbox" checked={showMemorized} onChange={function (e) { setShowMemorized(e.target.checked); }} /> Include memorized
              </label>
              <button
                onClick={function () { setAutoplaySound(!autoplaySound); }}
                className={cx(styles.controlButton, autoplaySound ? styles.controlButtonActive : "")}
              >
                Auto-speak new card: {autoplaySound ? "On" : "Off"}
              </button>
              <button onClick={resetMemorizedForCurrentSelection} className={cx(styles.controlButton, styles.warningButton)}>Reset memorized (custom)</button>
              <button onClick={function () { setActiveTab("study"); }} className={cx(styles.controlButton, styles.controlButtonActive)}>Go to Study</button>
            </div>

            <div className={styles.customList}>
              <div className={styles.customListInner}>
                {THAI_ITEMS.map(function (item, idx) {
                  var checked = customSelectedSet.has(item.id);
                  return (
                    <label key={item.id} className={styles.customItem}>
                      <input type="checkbox" checked={checked} onChange={function () { toggleCustomItem(item.id); }} />
                      <div className={styles.customChar}>{getChar(item)}</div>
                      <div className={styles.customInfo}>
                        <div className={styles.customName}>{item.name}</div>
                        <div className={styles.customMeta}>{item.sound} · {item.roman} · {item.type}</div>
                      </div>
                      <button
                        type="button"
                        onClick={function (e) { e.preventDefault(); e.stopPropagation(); speak(getChar(item), item.sound); }}
                        className={styles.customSpeakButton}
                      >
                        🔊
                      </button>
                      <div className={styles.customIndex}>#{idx + 1}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
