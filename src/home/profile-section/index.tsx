import styles from "./styles.module.scss";
import { ProfilePicture } from "../../components/common/profile-picture";
import { useTranslation } from "react-i18next";
import HomeNav from "../../components/nav/home-nav";

interface ProfileSectionProps {}
export const ProfileSection = (_props: ProfileSectionProps) => {
  const { t } = useTranslation();
  return (
    <section className={styles.profileSection}>
      <div className={styles.container}>
        <HomeNav dark={true} className={styles.nav} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentImage}>
          <ProfilePicture size={"medium"} />
        </div>
        <p>{t("home.about")}</p>
      </div>
    </section>
  );
};
