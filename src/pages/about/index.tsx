import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { ProfilePicture } from "../../components/common/profile-picture";

export const AboutPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={styles.content}>
        <ProfilePicture />
        <p>{t("about.section1")}</p>
        <p>{t("about.section2")}</p>
      </div>
    </div>
  );
};
