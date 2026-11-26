import { useTranslation } from "react-i18next";
import { ContentSection } from "../../content-section";
import { linkedinProfileUrl } from "../../../service/consts";
import styles from "./styles.module.scss";

export const AboutSection = () => {
  const { t } = useTranslation();

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
          <p>{t("home.aboutLead")}</p>
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
    </ContentSection>
  );
};
