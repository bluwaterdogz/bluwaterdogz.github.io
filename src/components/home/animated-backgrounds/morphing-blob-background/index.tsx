import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./morphing-blob-background.module.scss";

type MorphingBlobBackgroundProps = PropsWithChildren<{
  className?: string;
  colors?: string[];
  intensity?: number;
  speed?: number;
}>;

export const MorphingBlobBackground = ({
  children,
  className = "",
  colors = ["#ff9cdb", "#c2adff", "#96f4ff", "#e7ff96"],
  intensity = 1,
  speed = 1,
}: MorphingBlobBackgroundProps) => {
  const safeIntensity = Math.min(Math.max(intensity, 0), 2);
  const safeSpeed = Math.min(Math.max(speed, 0.2), 3);
  const durationMultiplier = 1 / safeSpeed;
  const blobColors = colors.length > 0 ? colors : ["#ff9cdb"];
  const customProperties = {
    "--blob-color-1": blobColors[0],
    "--blob-color-2": blobColors[1] ?? blobColors[0],
    "--blob-color-3": blobColors[2] ?? blobColors[0],
    "--blob-color-4": blobColors[3] ?? blobColors[0],
    "--blob-gradient": blobColors.join(", "),
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
        {blobColors.map((color, index) => {
          const variant = index % 4;
          const variantClass = [
            styles.blobOne,
            styles.blobTwo,
            styles.blobThree,
            styles.blobFour,
          ][variant];

          return (
            <div
              className={`${styles.blob} ${variantClass}`}
              key={`${color}-${index}`}
              style={{ "--blob-color": color } as CSSProperties}
            />
          );
        })}
        <div className={styles.colorWash} />
        <div className={styles.noise} />
      </div>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
