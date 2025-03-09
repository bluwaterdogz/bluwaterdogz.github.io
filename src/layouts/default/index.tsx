import { Outlet, useLocation } from "react-router";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { useLayoutEffect } from "react";
import { MobileNav } from "../../components/nav/mobile-nav";
import { MenuIcon } from "../../components/nav/menu-icon.tsx/menu-icon";
import { useNaveStore } from "../../stores/NavStore";

export const DefaultLayout = () => {
  const location = useLocation();
  const { navOpen, setNavOpen } = useNaveStore();

  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.defaultLayout}>
      <MenuIcon
        open={navOpen}
        setOpen={setNavOpen}
        className={`${styles.navIcon} ${navOpen ? styles.open : ""}`}
      />
      <Nav className={styles.defautlNav} />
      <MobileNav className={styles.mobileNav} />
      <Outlet />
    </div>
  );
};
