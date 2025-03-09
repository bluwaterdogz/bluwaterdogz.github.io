import styles from "./styles.module.scss";
interface DarkOverlayProps {
  opacity?: number | string;
}
export const DarkOverlay = ({ opacity = 0.4 }: DarkOverlayProps) => {
  return (
    <div
      className={styles.overlay}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
      }}
    />
  );
};
