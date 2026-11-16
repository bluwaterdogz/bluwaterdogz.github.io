import { useTranslation } from "react-i18next";
import { JobTimeline, JobTimelineItem } from "../../components/home/job-timeline";
import { SkillTimeline } from "../../components/skills/skill-timeline";
import { skillGroupings } from "../../service/skill/data";
import { linkedinProfileUrl } from "../../service/consts";
import { Statement } from "../../components/common/statement";
import { PageHeading } from "../../components/common/page-heading";
import { PageShell } from "../../components/common/page-shell";
import styles from "./styles.module.scss";

const interests = [
  { icon: "fa fa-picture-o", key: "climbing" },
  { icon: "fa fa-gamepad", key: "chess" },
  { icon: "fa fa-motorcycle", key: "dirtbike" },
  { icon: "fa fa-hand-rock-o", key: "muayThai" },
];

const allSkillGroups = skillGroupings;

export const AboutPage = () => {
  const { t } = useTranslation();
  const processSteps: JobTimelineItem[] = [
    {
      company: t("about.process.steps.align.title"),
      icon: "fa fa-crosshairs",
      number: "01",
      summary: t("about.process.steps.align.description"),
    },
    {
      company: t("about.process.steps.map.title"),
      icon: "fa fa-sitemap",
      number: "02",
      summary: t("about.process.steps.map.description"),
    },
    {
      company: t("about.process.steps.shape.title"),
      icon: "fa fa-lightbulb-o",
      number: "03",
      summary: t("about.process.steps.shape.description"),
    },
    {
      company: t("about.process.steps.build.title"),
      icon: "fa fa-code",
      number: "04",
      summary: t("about.process.steps.build.description"),
    },
    {
      company: t("about.process.steps.verify.title"),
      icon: "fa fa-shield",
      number: "05",
      summary: t("about.process.steps.verify.description"),
    },
    {
      company: t("about.process.steps.improve.title"),
      icon: "fa fa-line-chart",
      number: "06",
      summary: t("about.process.steps.improve.description"),
    },
  ];

  return (
    <PageShell
      className={styles.aboutPage}
      contentClassName={styles.pageContainer}
    >
        <section className={styles.introduction}>
          <PageHeading
            className={styles.copy}
            contentClassName={styles.headingContent}
            eyebrow={t("about.eyebrow")}
            title={t("about.title")}
          >
            <p className={styles.role}>{t("about.role")}</p>
            <div className={styles.divider} />
            <p>{t("about.section1")}</p>
            <p>{t("about.section2")}</p>
            <p className={styles.location}>
              <i className="fa fa-map-marker" aria-hidden="true" />
              {t("about.location")}
            </p>
            <a
              className={styles.link}
              href={linkedinProfileUrl}
              rel="noreferrer"
              target="_blank"
            >
              {t("about.cta")} <span aria-hidden="true">&#8594;</span>
            </a>
          </PageHeading>
          <div className={styles.portrait}>
            <img alt={t("about.portraitAlt")} src="/images/about/prof3.png" />
          </div>
        </section>

        <section className={styles.process}>
          <div className={styles.processIntroduction}>
            <p className={styles.eyebrow}>{t("about.process.eyebrow")}</p>
            <h2>{t("about.process.title")}</h2>
            <div className={styles.divider} />
            <p>{t("about.process.description")}</p>
            <div className={styles.processNote}>
              <h3>{t("about.process.generativeTitle")}</h3>
            </div>
            <p>{t("about.process.generativeDescription")}</p>
          </div>
          <JobTimeline
            className={styles.processTimeline}
            items={processSteps}
          />
        </section>

        <section className={styles.interests}>
          <p className={styles.eyebrow}>{t("about.outsideCode")}</p>
          <div className={styles.interestGrid}>
            {interests.map((interest) => (
              <article key={interest.key}>
                <i className={interest.icon} aria-hidden="true" />
                <h2>{t(`about.interests.${interest.key}.title`)}</h2>
                <p>{t(`about.interests.${interest.key}.description`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.buildWith}>
          <p className={styles.eyebrow}>{t("about.buildWith")}</p>
          <SkillTimeline groups={allSkillGroups} />
        </section>

        <Statement as="blockquote" className={styles.quote}>
          {t("about.quote")}
        </Statement>
    </PageShell>
  );
};
