import { useTranslation } from "react-i18next";
import { ContentSection } from "../../content-section";
import { Statement } from "../../common/statement";
import { linkedinProfileUrl } from "../../../service/consts";
import styles from "./styles.module.scss";

export const LeadershipSection = () => {
  const { t } = useTranslation();
  const practices = [
    {
      icon: "fa-users",
      title: t("home.leadership.practices.crossFunctional.title"),
      description: t(
        "home.leadership.practices.crossFunctional.description",
      ),
    },
    {
      icon: "fa-comments-o",
      title: t("home.leadership.practices.async.title"),
      description: t("home.leadership.practices.async.description"),
    },
    {
      icon: "fa-clone",
      title: t("home.leadership.practices.delivery.title"),
      description: t("home.leadership.practices.delivery.description"),
    },
    {
      icon: "fa-cube",
      title: t("home.leadership.practices.systems.title"),
      description: t("home.leadership.practices.systems.description"),
    },
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
      <div className={styles.approach}>
        <p className={styles.approachHeading}>
          {t("home.leadership.approachHeading")}
        </p>
        <Statement className={styles.statement}>
          {t("home.leadership.approachStatement")}
        </Statement>
        <div className={styles.practices}>
          {practices.map(({ description, icon, title }) => (
            <article className={styles.practice} key={title}>
              <span className={styles.practiceIcon}>
                <i aria-hidden="true" className={`fa ${icon}`} />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </ContentSection>
  );
};
