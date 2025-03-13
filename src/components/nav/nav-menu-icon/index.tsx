import { memo, useLayoutEffect } from "react";
import { useNaveStore } from "../../../stores/NavStore";
import { MenuIcon } from "../menu-icon.tsx/menu-icon";
import styles from "./styles.module.scss";

interface NavMenuIconProps {
  className?: string;
}

export const NavMenuIcon = memo((props: NavMenuIconProps) => {
  const { className = "" } = props;
  const { navOpen, setNavOpen } = useNaveStore();

  useLayoutEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  return (
    <MenuIcon
      className={`${className} ${styles.navIcon} ${navOpen ? styles.open : ""}`}
      open={navOpen}
      setOpen={setNavOpen}
    />
  );
});
