import { useMemo, useState } from "react";
import styles from "./golf_stroke_counter.module.scss";

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createHole(number) {
  return { id: uid(), holeNumber: number, strokes: 0 };
}

export default function GolfStrokeCounterApp() {
  const [holes, setHoles] = useState([createHole(1)]);
  const [completed, setCompleted] = useState(false);

  const currentHole = holes[holes.length - 1];
  const totalStrokes = useMemo(
    () => holes.reduce((sum, hole) => sum + (hole.strokes || 0), 0),
    [holes]
  );

  const addStroke = () => {
    if (completed) return;
    setHoles((prev) =>
      prev.map((hole, idx) =>
        idx === prev.length - 1
          ? { ...hole, strokes: hole.strokes + 1 }
          : hole
      )
    );
  };

  const newHole = () => {
    if (completed) return;
    setHoles((prev) => [...prev, createHole(prev.length + 1)]);
  };

  const finishRound = () => {
    setCompleted(true);
  };

  const resetRound = () => {
    setCompleted(false);
    setHoles([createHole(1)]);
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <h1>Golf Stroke Counter</h1>
        <p>Track strokes hole-by-hole and finish to see final scoring.</p>

        <section className={styles.scorePanel}>
          <div className={styles.scoreItem}>
            <span>Current Hole</span>
            <strong>{currentHole?.holeNumber || 1}</strong>
          </div>
          <div className={styles.scoreItem}>
            <span>Current Hole Strokes</span>
            <strong>{currentHole?.strokes || 0}</strong>
          </div>
          <div className={styles.scoreItem}>
            <span>Total Strokes</span>
            <strong>{totalStrokes}</strong>
          </div>
        </section>

        <section className={styles.actionRow}>
          <button onClick={newHole} disabled={completed}>
            New Hole
          </button>
          <button onClick={addStroke} disabled={completed}>
            Stroke
          </button>
          {!completed ? (
            <button onClick={finishRound} className={styles.primary}>
              Complete Round
            </button>
          ) : (
            <button onClick={resetRound} className={styles.primary}>
              New Game
            </button>
          )}
        </section>

        {completed ? (
          <section className={styles.results}>
            <h2>Round Complete</h2>
            <p>Total strokes: {totalStrokes}</p>
            <ul>
              {holes.map((hole) => (
                <li key={hole.id}>
                  Hole {hole.holeNumber}: {hole.strokes}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
