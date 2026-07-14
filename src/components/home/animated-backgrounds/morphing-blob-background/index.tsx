import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./morphing-blob-background.module.scss";

type MorphingBlobBackgroundProps = PropsWithChildren<{
  className?: string;
  colors?: [string, string, string, string];
  intensity?: number;
}>;

export const MorphingBlobBackground = ({
  children,
  className = "",
  colors = ["#ff72ce", "#a88cff", "#68efff", "#ddff68"],
  intensity = 1,
}: MorphingBlobBackgroundProps) => {
  const safeIntensity = Math.min(Math.max(intensity, 0), 1.5);
  const customProperties = {
    "--blob-color-1": colors[0],
    "--blob-color-2": colors[1],
    "--blob-color-3": colors[2],
    "--blob-color-4": colors[3],
    "--blob-opacity": Math.min(0.9, 0.62 * safeIntensity),
  } as CSSProperties;

  return (
    <section className={`${styles.container} ${className}`} style={customProperties}>
      <div className={styles.background} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blobOne}`} />
        <div className={`${styles.blob} ${styles.blobTwo}`} />
        <div className={`${styles.blob} ${styles.blobThree}`} />
        <div className={`${styles.blob} ${styles.blobFour}`} />
        <div className={styles.colorWash} />
        <div className={styles.noise} />
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
