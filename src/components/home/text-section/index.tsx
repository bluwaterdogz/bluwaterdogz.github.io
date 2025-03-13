import styles from "./styles.module.scss";
import { ReactNode } from "react";
import HomeNav from "../../nav/home-nav";
import { AnimationOnScroll } from "react-animation-on-scroll";

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
        <AnimationOnScroll
          duration={2}
          animateOnce={true}
          animateIn={`animate__fadeIn${right ? "Left" : "Right"}`}
        >
          <h2>{header}</h2>
          <span>{content}</span>
        </AnimationOnScroll>
      </div>
    </section>
  );
};
