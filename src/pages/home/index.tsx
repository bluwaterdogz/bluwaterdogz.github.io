import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { HeroSection } from "../../components/home/hero-section";
import { TextSection } from "../../components/home/text-section";
import { ImageSection } from "../../components/home/image-section";
import { ProfileSection } from "../../components/home/profile-section";
import Nav from "../../components/nav";
import { MobileNav } from "../../components/nav/mobile-nav";
import { useLayoutEffect } from "react";
import { NavMenuIcon } from "../../components/nav/nav-menu-icon";
import { Footer } from "../../components/footer";

export const HomePage = () => {
  const { t } = useTranslation();
  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className={styles.homePage}>
      <NavMenuIcon className={`${styles.navIcon}`} />
      <Nav className={styles.defautlNav} />
      <MobileNav className={styles.mobileNav} />
      <HeroSection />
      <ProfileSection />
      <ImageSection imgUrl="./imgs/theme1.jpg" />
      <TextSection
        right={false}
        header={t("home.section1Title")}
        content={
          <>
            <p>{t("home.section1Content1")}</p>
            <hr />
            <p>{t("home.section1Content2")}</p>
          </>
        }
      />
      <ImageSection imgUrl="./imgs/theme2.jpg" />
      <TextSection
        right={true}
        header={t("home.section2Title")}
        content={<p>{t("home.section2Content1")}</p>}
      />
      <ImageSection imgUrl="./imgs/theme3.jpg" />
      <Footer />
    </div>
  );
};
