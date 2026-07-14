import { Outlet, useLocation } from "react-router";
import styles from "./styles.module.scss";
import { useLayoutEffect } from "react";
import { MobileNav } from "../../components/nav/mobile-nav";
import { useNaveStore } from "../../stores/NavStore";
import { NavMenuIcon } from "../../components/nav/nav-menu-icon";
import { Footer } from "../../components/footer";
import HomeNav from "../../components/nav/home-nav";

export const DefaultLayout = () => {
  const location = useLocation();
  const setNavOpen = useNaveStore((state) => state.setNavOpen);

  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setNavOpen(false);
  }, [location.pathname, setNavOpen]);

  return (
    <div className={`${styles.defaultLayout}`}>
      <NavMenuIcon className={`${styles.navIcon}`} />
      <MobileNav className={styles.mobileNav} />
      <div className={styles.pageRegion}>
        <div className={styles.sideNavRegion}>
          <HomeNav dark={true} className={styles.sideNav} />
        </div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
