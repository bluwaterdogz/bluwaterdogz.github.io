import { Lang } from "../../../components/lang";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { PolyhedraBackground } from "../animated-backgrounds/polyhedra-background";
import { useThemeStore } from "../../../stores/ThemeStore";
import { MorphingBlobBackground } from "../animated-backgrounds/morphing-blob-background";

type BlobBackgroundConfig = {
  colors?: [string, string, string, string];
  vibrance?: number;
  speed?: number;
};

type GeometricBackgroundConfig = {
  shapeCount?: number;
  minShapeSize?: number;
  maxShapeSize?: number;
};

interface HeroSectionProps {
  blobBackground?: BlobBackgroundConfig;
  geometricBackground?: GeometricBackgroundConfig;
  imgUrl?: string;
}

export const HeroSection = (props: HeroSectionProps) => {
  const {
    blobBackground = {},
    geometricBackground = {},
    imgUrl = "/images/home/head_shot.png",
  } = props;
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const {
    colors = ["#ff72ce", "#a88cff", "#68efff", "#ddff68"],
    speed = 1,
    vibrance = 1,
  } = blobBackground;
  const {
    maxShapeSize = 120,
    minShapeSize = 70,
    shapeCount = 10,
  } = geometricBackground;

  return (
    <section className={styles.hero}>
      <div className={styles.flippity}>
        <MorphingBlobBackground
          colors={colors}
          intensity={vibrance}
          speed={speed}
        />
      </div>
      <div className={styles.flippity}>
        <PolyhedraBackground
          baseColor={
            theme === "dark"
              ? { r: 255, g: 255, b: 255 }
              : { r: 0, g: 0, b: 0 }
          }
          hoverColor={{ r: 165, g: 56, b: 96 }}
          maxSize={maxShapeSize}
          minSize={minShapeSize}
          objectCount={shapeCount}
        />
      </div>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      />
      <div className={styles.container}>
        <Lang className={styles.languageDropdown} />
        <div className={styles.content}>
          <p className={styles.eyebrow}>{t("home.heroEyebrow")}</p>
          <h1>{t("home.heroName")}</h1>
          <p className={styles.role}>{t("home.heroRole")}</p>
          <div className={styles.divider} />
          <p className={styles.introduction}>{t("home.heroIntroduction")}</p>
        </div>
      </div>
    </section>
  );
};
