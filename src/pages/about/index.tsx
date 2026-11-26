import { useTranslation } from "react-i18next";
import { SkillTimeline } from "../../components/skills/skill-timeline";
import { skillGroupings } from "../../service/skill/data";
import { linkedinProfileUrl } from "../../service/consts";
import { Statement } from "../../components/common/statement";
import { PageHeading } from "../../components/common/page-heading";
import { PageShell } from "../../components/common/page-shell";
import { InterestList } from "./interest-list";
import { ProcessTimeline } from "./process-timeline";
import styles from "./styles.module.scss";

const allSkillGroups = skillGroupings;

export const AboutPage = () => {
  const { t } = useTranslation();

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
            {/* <p className={styles.location}>
              <i className="fa fa-map-marker" aria-hidden="true" />
              {t("about.location")}
            </p> */}
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
          <ProcessTimeline className={styles.processTimeline} />
        </section>

        <section className={styles.interests}>
          <p className={styles.eyebrow}>{t("about.outsideCode")}</p>
          <InterestList />
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
