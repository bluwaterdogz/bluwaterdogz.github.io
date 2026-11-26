import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

const interests = [
  { icon: "fa fa-picture-o", key: "climbing" },
  { icon: "fa fa-gamepad", key: "chess" },
  { icon: "fa fa-motorcycle", key: "dirtbike" },
  { icon: "fa fa-hand-rock-o", key: "muayThai" },
] as const;

export const InterestList = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.interestGrid}>
      {interests.map(({ icon, key }) => (
        <article key={key}>
          <i className={icon} aria-hidden="true" />
          <h2>{t(`about.interests.${key}.title`)}</h2>
          <p>{t(`about.interests.${key}.description`)}</p>
        </article>
      ))}
    </div>
  );
};
