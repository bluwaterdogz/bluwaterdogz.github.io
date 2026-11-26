import { Lang } from "../../../components/lang";
import styles from "./styles.module.scss";
import { Trans, useTranslation } from "react-i18next";
import { PolyhedraBackground } from "../animated-backgrounds/polyhedra-background";
import { useThemeStore } from "../../../stores/ThemeStore";
import { MorphingBlobBackground } from "../animated-backgrounds/morphing-blob-background";
import { blobColors } from "../animated-backgrounds/morphing-blob-background/colors";
import { Link } from "react-router-dom";
import { linkedinProfileUrl } from "../../../service/consts";
import { skills } from "../../../service/skill/data";
import { SkillPills } from "../../common/skill-pills";

const featuredSkillIds = ["3", "9", "1", "26", "5", "29", "38"];

type BlobBackgroundConfig = {
  backgroundColor?: string;
  blendMode?: "multiply" | "screen";
  colors?: string[];
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
    imgUrl = "/images/home/portrait_small.png",
  } = props;
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const immersive = theme === "dark";
  const {
    backgroundColor = "var(--background)",
    blendMode = theme === "dark" ? "screen" : "multiply",
    colors = blobColors,
    speed = 1,
    vibrance = 1,
  } = blobBackground;
  const {
    maxShapeSize = 320,
    minShapeSize = 70,
    shapeCount = 7,
  } = geometricBackground;


  return (
    <section
      className={`${styles.hero} ${immersive ? styles.immersive : ""}`}
      data-hero-variant={immersive ? "immersive" : "original"}
    >
      <div className={`${styles.backgroundLayer} ${styles.blobLayer}`}>
        <MorphingBlobBackground
          backgroundColor={backgroundColor}
          blendMode={blendMode}
          colors={colors}
          intensity={vibrance}
          speed={speed}
        />
      </div>
      <div className={`${styles.backgroundLayer} ${styles.polyhedraLayer}`}>
        <PolyhedraBackground
          baseColor={theme === "dark" ? { r: 165, g: 238, b: 255 } : { r: 255, g: 255, b: 255 }}
          hoverColor={theme === "dark" ? { r: 206, g: 174, b: 255 } : { r: 255, g: 255, b: 255 }}
          rimLightColor={theme === "dark" ? { r: 230, g: 211, b: 255 } : { r: 255, g: 255, b: 255 }}
          glowColors={theme === "dark" ? [
            { r: 117, g: 230, b: 255 },
            { r: 112, g: 156, b: 255 },
            { r: 183, g: 143, b: 255 },
          ] : [{ r: 255, g: 255, b: 255 }]}
          maxSize={maxShapeSize}
          minSize={minShapeSize}
          objectCount={shapeCount}
        />
      </div>
      <div className={styles.topBar}>
        <Lang className={styles.languageDropdown} />
      </div>
      <div className={styles.container}>
        <img alt="" className={styles.portrait} src={imgUrl} />
        <div className={styles.content}>
          <h1>
            <span className={styles.desktopHeadline}>
              <span className={styles.headlineStart}>
                {t("home.heroHeadlineStart")}
              </span>{" "}
              <em>{t("home.heroHeadlineAccent")}</em>{" "}
              <span className={styles.headlineEnd}>
                {t("home.heroHeadlineEnd")}
              </span>
            </span>
            <span className={styles.mobileHeadline}>
              <Trans
                i18nKey={immersive ? "home.heroHeadlineDark" : "home.heroHeadlineCompact"}
                components={{
                  start: <span className={styles.headlineStart} />,
                  phrase: <span className={styles.headlinePhrase} />,
                  end: <span className={styles.headlineEnd} />,
                  accent: <em />,
                  dot: <span className={styles.headlineDot} />,
                }}
              />
            </span>
          </h1>
          <p className={styles.introduction}>{t("home.heroIntroduction")}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/projects">
              {t("home.heroPrimaryCta")}
            </Link>
            <a
              className={styles.secondaryAction}
              href={linkedinProfileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("home.heroSecondaryCta")}
            </a>
          </div>
          <SkillPills
            ariaLabel={t("home.heroSkillsLabel")}
            className={styles.skills}
            skills={skills.filter(({ id }) => featuredSkillIds.includes(id))}
          />
        </div>
      </div>
    </section>
  );
};
