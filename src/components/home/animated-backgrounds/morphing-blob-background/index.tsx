import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./morphing-blob-background.module.scss";

type MorphingBlobBackgroundProps = PropsWithChildren<{
  className?: string;
  colors?: [string, string, string, string];
  intensity?: number;
  speed?: number;
}>;

export const MorphingBlobBackground = ({
  children,
  className = "",
  colors = ["#ff72ce", "#a88cff", "#68efff", "#ddff68"],
  intensity = 1,
  speed = 1,
}: MorphingBlobBackgroundProps) => {
  const safeIntensity = Math.min(Math.max(intensity, 0), 2);
  const safeSpeed = Math.min(Math.max(speed, 0.2), 3);
  const durationMultiplier = 1 / safeSpeed;
  const customProperties = {
    "--blob-color-1": colors[0],
    "--blob-color-2": colors[1],
    "--blob-color-3": colors[2],
    "--blob-color-4": colors[3],
    "--blob-opacity": Math.min(0.95, 0.62 * safeIntensity),
    "--blob-saturation": `${Math.round(110 * safeIntensity)}%`,
    "--blob-move-1-duration": `${18 * durationMultiplier}s`,
    "--blob-move-2-duration": `${22 * durationMultiplier}s`,
    "--blob-move-3-duration": `${25 * durationMultiplier}s`,
    "--blob-move-4-duration": `${20 * durationMultiplier}s`,
    "--blob-morph-1-duration": `${11 * durationMultiplier}s`,
    "--blob-morph-2-duration": `${14 * durationMultiplier}s`,
    "--blob-morph-3-duration": `${16 * durationMultiplier}s`,
    "--blob-morph-4-duration": `${13 * durationMultiplier}s`,
    "--blob-wash-duration": `${40 * durationMultiplier}s`,
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
