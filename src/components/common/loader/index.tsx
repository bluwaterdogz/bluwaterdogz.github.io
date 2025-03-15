import styles from "./styles.module.scss";
interface LoaderProps {
  fullscreen?: boolean;
}
export const Loader = (props: LoaderProps) => {
  const { fullscreen = false } = props;

  return (
    <div
      className={`${styles.container} ${fullscreen ? styles.fullscreen : ""} `}
    >
      <div className={styles.loader}></div>
    </div>
  );
};
