import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import HomeNav from "../../components/nav/home-nav";
import { AnimationOnScroll } from "react-animation-on-scroll";

interface ProfileSectionProps {}
export const ProfileSection = (_props: ProfileSectionProps) => {
  const { t } = useTranslation();
  return (
    <section className={styles.profileSection}>
      <div className={styles.container}>
        <HomeNav dark={true} className={styles.nav} />
      </div>
      <div className={styles.content}>
        <AnimationOnScroll
          animateOnce={true}
          duration={2}
          animateIn={`animate__fadeIn`}
        >
          <h2>Who am I?</h2>
          <p>{t("home.about")}</p>
        </AnimationOnScroll>
      </div>
    </section>
  );
};
