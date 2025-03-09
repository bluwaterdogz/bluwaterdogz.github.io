import { memo } from "react";
import { useNaveStore } from "../../../stores/NavStore";
import { MenuIcon } from "../../nav/menu-icon.tsx/menu-icon";
interface NavMenuIconProps {
  className?: string;
}
export const NavMenuIcon = memo((props: NavMenuIconProps) => {
  const { className = "" } = props;
  const { navOpen, setNavOpen } = useNaveStore();

  return (
    <MenuIcon className={`${className} `} open={navOpen} setOpen={setNavOpen} />
  );
});
