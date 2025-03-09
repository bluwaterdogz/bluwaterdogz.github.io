import styles from "./styles.module.scss";
import { HTMLProps, ReactNode } from "react";
import { navItems } from "./consts";
import { NavList } from "./nav-list";
import { Lang } from "../lang";

interface NavProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
}

const Nav = (props: NavProps) => {
  const { children = null, className } = props;
  return (
    <div className={`${styles.nav} ${className}`}>
      <NavList navItems={navItems} />
      <Lang className={styles.languageDropdown} dark={false} />
      {children != null ? (
        <div className={styles.navChildren}>{children}</div>
      ) : null}
    </div>
  );
};

export default Nav;
