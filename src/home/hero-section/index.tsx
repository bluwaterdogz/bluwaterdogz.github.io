import { useTranslation } from "react-i18next";
import { DarkOverlay } from "../../components/common/dark-overlay";
import { Lang } from "../../components/lang";
import styles from "./styles.module.scss";
import HomeNav from "../../components/nav/home-nav";

interface HeroSectionProps {
  imgUrl?: string;
}

export const HeroSection = (props: HeroSectionProps) => {
  const { imgUrl = "./dog.jpg" } = props;
  const { t } = useTranslation();

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${imgUrl})`,
      }}
    >
      <DarkOverlay />
      <div className={styles.container}>
        <HomeNav className={styles.nav} />
        <Lang className={styles.languageDropdown} />
        <div className={styles.content}>
          <h1>Brian Velasquez</h1>
          <p className={styles.headerSubtext}>{t("home.sub")}</p>
        </div>
      </div>
    </section>
  );
};
