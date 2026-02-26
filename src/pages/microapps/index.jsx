import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const microapps = [
  {
    id: "thai-flashcards",
    title: "Thai Learning Flashcards",
    description:
      "Practice Thai letters and sounds with grouped study sets, custom selection, and memorization tracking.",
    href: "/microapps/thai-flashcards",
  },
  {
    id: "todo",
    title: "Todo App",
    description:
      "Organize tasks with categories, subtasks, drag-and-drop ordering, and local storage persistence.",
    href: "/microapps/todo",
  },
];

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
