import { Lang } from "../../../components/lang";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { PolyhedraBackground } from "../animated-backgrounds/polyhedra-background";
import { useThemeStore } from "../../../stores/ThemeStore";
import { MorphingBlobBackground } from "../animated-backgrounds/morphing-blob-background";
import { Link } from "react-router-dom";
import { linkedinProfileUrl } from "../../../service/consts";
import { skills } from "../../../service/skill/data";
import { SkillPills } from "../../common/skill-pills";

const featuredSkillIds = ["3", "9", "1", "26", "5", "29", "38"];

type BlobBackgroundConfig = {
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
  const {
    colors = [
      "#ff9cdb",
      // "#c2adff",
      // "#96f4ff",
      // "#e7ff96"
    ],
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
      <div className={`${styles.flippity} ${styles.blobLayer}`}>
        <MorphingBlobBackground
          colors={colors}
          intensity={vibrance}
          speed={speed}
        />
      </div>
      <div aria-hidden="true" className={styles.animationBlur} />
      <div className={`${styles.flippity} ${styles.polyhedraLayer}`}>
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
      <div aria-hidden="true" className={styles.polyhedraBlur} />
      <img alt="" className={styles.portrait} src={imgUrl} />
      <div className={styles.topBar}>
        <Lang className={styles.languageDropdown} />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{t("home.heroEyebrow")}</p>
          <h1>
            {t("home.heroHeadlineStart")} {" "}
            <em>{t("home.heroHeadlineAccent")}</em>{" "}
            {t("home.heroHeadlineEnd")}
          </h1>
          <p className={styles.introduction}>{t("home.heroIntroduction")}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} to="/projects">
              {t("home.heroPrimaryCta")}
              <span aria-hidden="true">↗</span>
            </Link>
            <a
              className={styles.secondaryAction}
              href={linkedinProfileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("home.heroSecondaryCta")}
              <span aria-hidden="true">↗</span>
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
