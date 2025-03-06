import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { NavLink } from "./nav-link";
import { ReactNode } from "react";
interface NavProps {
  vertical: boolean;
  dark?: boolean;
  children?: ReactNode;
}
const Nav = ({ vertical, dark = false, children = null }: NavProps) => {
  const { t } = useTranslation();
  return (
    <div
      className={`${styles.nav} ${dark ? styles.dark : styles.light} ${
        vertical ? styles.vertical : ""
      }`}
    >
      <NavLink to={"/home"}>{t("nav.home")}</NavLink>
      <NavLink to={"/skills"}>{t("nav.skills")}</NavLink>
      <NavLink to={"/projects"}>{t("nav.projects")}</NavLink>
      <NavLink to={"/about"}>{t("nav.about")}</NavLink>
      <NavLink to={"/jobs"}>{t("nav.jobs")}</NavLink>
      {children != null ? (
        <div className={styles.navChildren}>{children}</div>
      ) : null}
    </div>
  );
};

export default Nav;
