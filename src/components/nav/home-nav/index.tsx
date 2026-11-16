import styles from "./styles.module.scss";
import { navItems } from "../consts";
import { NavList } from "../nav-list";
import { HTMLProps } from "react";
type HomeNavProps = HTMLProps<HTMLDivElement>;

const HomeNav = (props: HomeNavProps) => {
  const { className, ...rest } = props;
  return (
    <div
      {...rest}
      className={`${styles.homeNav} ${className ?? ""}`}
    >
      <NavList navItems={navItems} />
    </div>
  );
};

export default HomeNav;
