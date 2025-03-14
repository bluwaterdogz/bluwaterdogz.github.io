import { Outlet, useLocation } from "react-router";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { useLayoutEffect } from "react";
import { MobileNav } from "../../components/nav/mobile-nav";
import { useNaveStore } from "../../stores/NavStore";
import { NavMenuIcon } from "../../components/nav/nav-menu-icon";

export const DefaultLayout = () => {
  const location = useLocation();
  const setNavOpen = useNaveStore((state) => state.setNavOpen);

  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={`${styles.defaultLayout}`}>
      <NavMenuIcon className={`${styles.navIcon}`} />
      <Nav className={styles.defautlNav} />
      <MobileNav className={styles.mobileNav} />
      <Outlet />
    </div>
  );
};
