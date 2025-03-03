import styles from "./styles.module.scss";
import { BackgroundAnimation } from "../../components/background-animation";

interface PlaceholderProps {}
export const PlaceholderPage: React.FunctionComponent<PlaceholderProps> = (
  _props
) => {
  return (
    <div className={styles.content}>
      <BackgroundAnimation />
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          <p>
            <span className={styles.letter}>C</span>
            <span className={styles.letter}>o</span>
            <span className={styles.letter}>m</span>
            <span className={styles.letter}>i</span>
            <span className={styles.letter}>n</span>
            <span className={styles.letter}>g</span>
          </p>
          <p>
            <span className={styles.letter}>S</span>
            <span className={styles.letter}>o</span>
            <span className={styles.letter}>o</span>
            <span className={styles.letter}>n</span>
            <span className={styles.letter}>.</span>
            <span className={styles.letter}>.</span>
            <span className={styles.letter}>.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
