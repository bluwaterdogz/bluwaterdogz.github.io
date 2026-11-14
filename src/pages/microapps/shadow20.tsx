import { useState } from "react";
import styles from "./shadow20.module.scss";

const GAME_URL = "/games/shadow20/index.html";

export default function Shadow20() {
  const [instance, setInstance] = useState(0);
  const [loading, setLoading] = useState(true);

  const restart = () => {
    setLoading(true);
    setInstance((current) => current + 1);
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Canvas action platformer</p>
          <h1>Shadow / 20</h1>
        </div>

        <button type="button" onClick={restart}>
          Restart game
        </button>
      </header>

      <div className={styles.gameFrame} aria-busy={loading}>
        {loading && <p className={styles.loading}>Loading Shadow / 20…</p>}

        <iframe
          key={instance}
          className={styles.game}
          src={GAME_URL}
          title="Shadow / 20 game"
          onLoad={() => setLoading(false)}
          allow="autoplay"
        />
      </div>
    </main>
  );
}
