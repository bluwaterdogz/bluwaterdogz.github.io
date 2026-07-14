import { Link, useSearchParams } from "react-router-dom";
import { SkillTimeline } from "../../components/skills/skill-timeline";
import {
  getSkillGroupingsForSection,
  skillSections,
} from "../../service/skill/data";
import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { PageHeading } from "../../components/common/page-heading";
import { PageShell } from "../../components/common/page-shell";

export const SkillsPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const requestedIndex = skillSections.findIndex(
    (section) => section.id === searchParams.get("skillType")
  );
  const activeViewIndex = requestedIndex >= 0 ? requestedIndex : 0;
  const activeView = skillSections[activeViewIndex];
  const previousView =
    skillSections[
      (activeViewIndex - 1 + skillSections.length) % skillSections.length
    ];
  const nextView =
    skillSections[(activeViewIndex + 1) % skillSections.length];

  return (
    <PageShell className={styles.skillsPage}>
        <div className={styles.layout}>
          <PageHeading
            className={styles.introduction}
            description={t(`skills.views.${activeView.i18nKey}.description`)}
            descriptionClassName={styles.copy}
            eyebrow={t("skills.eyebrow")}
            title={t(`skills.views.${activeView.i18nKey}.title`)}
          >
            <div className={styles.viewSwitcher}>
              <Link
                aria-label={t("skills.previous")}
                title={t("skills.previous")}
                to={`/skills?skillType=${previousView.id}`}
              >
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </Link>
              <span>
                {activeViewIndex + 1} / {skillSections.length}
              </span>
              <Link
                aria-label={t("skills.next")}
                title={t("skills.next")}
                to={`/skills?skillType=${nextView.id}`}
              >
                <i className="fa fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
            <Link className={styles.link} to="/projects">
              {t("skills.projectsLink")}
              <span aria-hidden="true">&#8594;</span>
            </Link>
          </PageHeading>
          <SkillTimeline groups={getSkillGroupingsForSection(activeView)} />
        </div>
    </PageShell>
  );
};
