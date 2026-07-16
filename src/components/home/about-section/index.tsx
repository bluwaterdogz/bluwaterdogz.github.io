import { useTranslation } from "react-i18next";
import { FeatureList, FeatureListItem } from "../feature-list";
import { ContentSection } from "../../content-section";
import { linkedinProfileUrl } from "../../../service/consts";
import styles from "./styles.module.scss";

export const AboutSection = () => {
  const { t } = useTranslation();
  const features: FeatureListItem[] = [
    { icon: "fa-calendar", value: "10+", label: t("home.features.experience") },
    { icon: "fa-code", value: "30+", label: t("home.features.projects") },
    {
      icon: "fa-users",
      value: t("home.features.international"),
      label: t("home.features.collaboration"),
    },
    {
      icon: "fa-rocket",
      value: t("home.features.focus"),
      label: t("home.features.performance"),
    },
  ];

  return (
    <ContentSection
      id="about"
      sectionClassName={styles.aboutSection}
      contentClassName={styles.content}
    >
      <div className={styles.introduction}>
        <p className={styles.eyebrow}>{t("home.aboutEyebrow")}</p>
        <h2>{t("home.aboutTitle")}</h2>
        <div className={styles.copy}>
          <p>{t("home.about")}</p>
        </div>
        <a
          className={styles.link}
          href={linkedinProfileUrl}
          rel="noreferrer"
          target="_blank"
        >
          {t("home.aboutLink")}
          <span aria-hidden="true">&#8594;</span>
        </a>
      </div>
      <FeatureList items={features} />
    </ContentSection>
  );
};
