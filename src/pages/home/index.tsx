import styles from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { HeroSection } from "../../home/hero-section";
import { TextSection } from "../../home/text-section";
import { ImageSection } from "../../home/image-section";
import { ProfileSection } from "../../home/profile-section";
import Nav from "../../components/nav";
import { MobileNav } from "../../components/nav/mobile-nav";
import { MenuIcon } from "../../components/nav/menu-icon.tsx/menu-icon";
import { useNaveStore } from "../../stores/NavStore";
import { useLayoutEffect } from "react";

export const HomePage = () => {
  const { t } = useTranslation();
  const { navOpen, setNavOpen } = useNaveStore();
  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.homePage}>
      {/* // TODO: switch to NavMenuIcon which memoizes state */}
      <MenuIcon
        open={navOpen}
        setOpen={setNavOpen}
        className={`${styles.navIcon} ${navOpen ? styles.open : ""}`}
      />
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
    </div>
  );
};
