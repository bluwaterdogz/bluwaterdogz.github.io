import styles from "./styles.module.scss";
import { HTMLProps, ReactNode, useRef } from "react";
import { navItems } from "../consts";
import { MenuIcon } from "../menu-icon.tsx/menu-icon";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { NavList } from "../nav-list";
import { Lang } from "../../lang";
import { useNaveStore } from "../../../stores/NavStore";
interface MobileNavProps extends HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  open?: boolean;
  setOpen?: (v: boolean) => void;
}
export const MobileNav = (props: MobileNavProps) => {
  const { children = null, open, setOpen, className, ...rest } = props;
  const ref = useRef(null);
  const { navOpen, setNavOpen } = useNaveStore();

  useOutsideClick(ref, () => {
    () => {
      setNavOpen(false);
    };
  });

  return (
    <div className={`${styles.container} ${className}`} ref={ref} {...rest}>
      <div className={`${styles.mobileNav} ${navOpen ? styles.open : ""}`}>
        <div className={styles.iconContainer}>
          <MenuIcon
            {...({
              onClick: () => {
                setNavOpen(true);
              },
              open: navOpen,
              setOpen: setNavOpen,
            } as any)}
          />
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
