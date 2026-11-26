import { useLayoutEffect } from "react";
import { useNavStore } from "../../../stores/NavStore";
import { MenuIcon } from "../menu-icon";
import styles from "./styles.module.scss";
import { useLocation } from "react-router-dom";

interface NavMenuIconProps {
  className?: string;
}

export const NavMenuIcon = (props: NavMenuIconProps) => {
  const { className = "" } = props;
  const { navOpen, setNavOpen } = useNavStore();
  const location = useLocation();

  useLayoutEffect(() => {
    setNavOpen(false);
  }, [location.pathname, setNavOpen]);

  return (
    <div className={styles.menuIconContainer}>
      <MenuIcon
        className={`${className} ${styles.navIcon} ${
          navOpen ? styles.open : ""
        }`}
        open={navOpen}
        setOpen={setNavOpen}
      />
    </div>
  );
};
