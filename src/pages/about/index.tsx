import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.content}>
        <div
          className={styles.headShot}
          style={{ backgroundImage: 'url("/imgs/brian.jpg")' }}
        ></div>
        <p>{t("about.section1")}</p>
        <p>{t("about.section2")}</p>
      </div>
    </div>
  );
};
