import { useTranslation } from "react-i18next";
import { ContentSection } from "../../content-section";
import {
  CollaborationRegion,
  CollaborationRegions,
} from "../collaboration-regions";
import asia from "../../../assets/svgs/asia.svg";
import europe from "../../../assets/svgs/europe.svg";
import northAmerica from "../../../assets/svgs/north-america.svg";
import southAmerica from "../../../assets/svgs/south-america.svg";
import { linkedinProfileUrl } from "../../../service/consts";
import styles from "./styles.module.scss";

export const LeadershipSection = () => {
  const { t } = useTranslation();
  const regions: CollaborationRegion[] = [
    {
      iconUrl: northAmerica,
      label: t("home.leadership.regions.northAmerica"),
    },
    {
      iconUrl: southAmerica,
      label: t("home.leadership.regions.southAmerica"),
    },
    { iconUrl: europe, label: t("home.leadership.regions.europe") },
    { iconUrl: asia, label: t("home.leadership.regions.asia") },
  ];

  return (
    <ContentSection
      id="leadership"
      sectionClassName={styles.leadershipSection}
      contentClassName={styles.content}
    >
      <div className={styles.introduction}>
        <p className={styles.eyebrow}>{t("home.leadership.eyebrow")}</p>
        <h2>{t("home.leadership.title")}</h2>
        <div className={styles.copy}>
          <p>{t("home.leadership.copy1")}</p>
          <p>{t("home.leadership.copy2")}</p>
          <p>{t("home.leadership.copy3")}</p>
        </div>
        <a
          className={styles.link}
          href={linkedinProfileUrl}
          rel="noreferrer"
          target="_blank"
        >
          {t("home.leadership.link")}
          <span aria-hidden="true">&#8594;</span>
        </a>
      </div>
      <CollaborationRegions
        heading={t("home.leadership.regionsHeading")}
        regions={regions}
        summary={t("home.leadership.summary")}
        stats={[
          t("home.leadership.stats.regions"),
          t("home.leadership.stats.timeZones"),
        ]}
      />
    </ContentSection>
  );
};
