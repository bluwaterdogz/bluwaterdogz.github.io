import styles from "./styles.module.scss";
import { navItems } from "../consts";
import { NavList } from "../nav-list";
import { HTMLProps } from "react";
interface HomeNavProps extends HTMLProps<HTMLDivElement> {
  dark?: boolean;
}
const HomeNav = (props: HomeNavProps) => {
  const { dark = false, className, ...rest } = props;
  return (
    <div
      {...rest}
      className={`${styles.homeNav} ${className} ${
        dark ? styles.dark : styles.light
      }`}
    >
      <NavList navItems={navItems} />
    </div>
  );
};

export default HomeNav;
