import type { CSSProperties, PropsWithChildren } from "react";
import { blobColors } from "./colors";
import styles from "./morphing-blob-background.module.scss";

type MorphingBlobBackgroundProps = PropsWithChildren<{
  backgroundColor?: string;
  blendMode?: "multiply" | "screen";
  className?: string;
  colors?: string[];
  intensity?: number;
  speed?: number;
}>;

export const MorphingBlobBackground = ({
  backgroundColor = "transparent",
  blendMode = "multiply",
  children,
  className = "",
  colors = blobColors,
  intensity = 1,
  speed = 1,
}: MorphingBlobBackgroundProps) => {
  const safeIntensity = Math.min(Math.max(intensity, 0), 2);
  const safeSpeed = Math.min(Math.max(speed, 0.2), 3);
  const durationMultiplier = 1 / safeSpeed;
  const palette = colors.length > 0 ? colors : blobColors;
  const customProperties = {
    "--blob-background": backgroundColor,
    "--blob-blend-mode": blendMode,
    "--blob-color-1": palette[0],
    "--blob-color-2": palette[1] ?? palette[0],
    "--blob-color-3": palette[2] ?? palette[0],
    "--blob-color-4": palette[3] ?? palette[0],
    "--blob-gradient": palette.join(", "),
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
        {palette.map((color, index) => {
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
