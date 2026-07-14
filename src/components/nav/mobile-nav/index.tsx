import styles from "./styles.module.scss";
import { HTMLProps, useRef } from "react";
import { navItems } from "../consts";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { NavList } from "../nav-list";
import { Lang } from "../../lang";
import { useNaveStore } from "../../../stores/NavStore";
import { NavMenuIcon } from "../nav-menu-icon";

interface MobileNavProps extends HTMLProps<HTMLDivElement> {
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

export const MobileNav = (props: MobileNavProps) => {
  const { className } = props;
  const ref = useRef(null);
  const { navOpen, setNavOpen } = useNaveStore();

  useOutsideClick(ref, () => {
    setNavOpen(false);
  });

  return (
    <div className={`${className}`}>
      <div
        className={`${styles.mobileNav} ${navOpen ? styles.open : ""}`}
        ref={ref}
      >
        <div className={styles.iconContainer}>
          <NavMenuIcon className={styles.navButton} />
        </div>
        <NavList navItems={navItems} />
        <Lang
          className={styles.languageDropdown}
          dark={true}
          alignRight={true}
        />
      </div>
    </div>
  );
};
