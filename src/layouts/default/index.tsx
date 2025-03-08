import { Outlet, useLocation } from "react-router";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { Lang } from "../../components/lang";
import { useLayoutEffect } from "react";

export const DefaultLayout = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div>
      <div>
        <div className={styles.header}>
          <Nav vertical={false} />
          <Lang className={styles.languageDropdown} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};
