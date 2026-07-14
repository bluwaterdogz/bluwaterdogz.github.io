import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ContentSection } from "../../content-section";
import { JobTimeline, JobTimelineItem } from "../job-timeline";
import styles from "./styles.module.scss";

export const ExperienceSection = () => {
  const { t } = useTranslation();
  const jobs: JobTimelineItem[] = [
    {
      employer: "mobian",
      period: t("home.experience.timeline.mobianPeriod"),
      company: t("home.experience.timeline.mobianCompany"),
      summary: t("home.experience.timeline.mobianSummary"),
    },
    {
      employer: "independent",
      period: t("home.experience.timeline.contractorPeriod"),
      company: t("home.experience.timeline.contractorCompany"),
      summary: t("home.experience.timeline.contractorSummary"),
    },
    {
      employer: "faro",
      period: t("home.experience.timeline.faroPeriod"),
      company: t("home.experience.timeline.faroCompany"),
      summary: t("home.experience.timeline.faroSummary"),
    },
    {
      employer: "various",
      period: t("home.experience.timeline.variousPeriod"),
      company: t("home.experience.timeline.variousCompany"),
      summary: t("home.experience.timeline.variousSummary"),
    },
    {
      employer: "launchBrigade",
      period: t("home.experience.timeline.launchPeriod"),
      company: t("home.experience.timeline.launchCompany"),
      summary: t("home.experience.timeline.launchSummary"),
    },
  ];

  return (
    <ContentSection
      id="experience"
      sectionClassName={styles.experienceSection}
      contentClassName={styles.content}
    >
      <div className={styles.introduction}>
        <p className={styles.eyebrow}>{t("home.experience.eyebrow")}</p>
        <h2>{t("home.experience.title")}</h2>
        <div className={styles.copy}>
          <p>{t("home.experience.copy1")}</p>
          <p>{t("home.experience.copy2")}</p>
          <p>{t("home.experience.copy3")}</p>
          <p>{t("home.experience.copy4")}</p>
          <p>{t("home.experience.copy5")}</p>
        </div>
        <Link className={styles.link} to="/about">
          {t("home.experience.link")}
          <span aria-hidden="true">&#8594;</span>
        </Link>
      </div>
      <JobTimeline heading={t("home.experience.timelineHeading")} items={jobs} />
    </ContentSection>
  );
};
