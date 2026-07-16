import { Link } from "react-router-dom";
import { microapps } from "./registry";
import styles from "./styles.module.scss";

export const MicroappsPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <h1>Microapps</h1>
        <p>Small focused apps built inside this site.</p>
      </section>
      <section className={styles.cardGrid}>
        {microapps.map((app) => (
          <Link key={app.id} to={app.href} className={styles.card}>
            <h2>{app.title}</h2>
            <p>{app.description}</p>
            <span className={styles.cta}>Open app</span>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default MicroappsPage;
