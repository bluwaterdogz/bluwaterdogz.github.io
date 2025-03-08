import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { NavLink } from "./nav-link";
import { ReactNode, useMemo } from "react";
interface NavProps {
  vertical: boolean;
  dark?: boolean;
  children?: ReactNode;
}
const Nav = ({ vertical, dark = false, children = null }: NavProps) => {
  const { t } = useTranslation();

  const navMap = useMemo(
    () => ({
      home: "/",
      skills: "/skills",
      projects: "/projects",
      about: "/about",
      // jobs: "/jobs",
    }),
    []
  );

  const navList = useMemo(() => Object.keys(navMap), []);

  return (
    <div
      className={`${styles.nav} ${dark ? styles.dark : styles.light} ${
        vertical ? styles.vertical : ""
      }`}
    >
      {navList.map((k) => (
        <NavLink key={k} to={(navMap as any)[k]}>
          {t(`nav.${k}`)}
        </NavLink>
      ))}
      {children != null ? (
        <div className={styles.navChildren}>{children}</div>
      ) : null}
    </div>
  );
};

export default Nav;
