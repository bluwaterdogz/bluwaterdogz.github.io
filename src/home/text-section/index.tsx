import styles from "./styles.module.scss";
import { ReactNode } from "react";
import HomeNav from "../../components/nav/home-nav";

interface TextSectionProps {
  right?: boolean;
  header: ReactNode;
  content: ReactNode;
}
export const TextSection = (props: TextSectionProps) => {
  const { right = false, header, content } = props;

  return (
    <section
      className={`${styles.textSection} ${right ? styles.right : styles.left}`}
    >
      <div className={styles.container}>
        <HomeNav dark={true} className={styles.nav} />
      </div>
      <div className={styles.content}>
        <h2>{header}</h2>
        {content}
      </div>
    </section>
  );
};
