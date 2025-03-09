import { useTranslation } from "react-i18next";
import { NavLink } from "../nav-link";
import { useMemo } from "react";
import { NavItemMap } from "../types";
interface NavListProps {
  navItems: NavItemMap;
}
export const NavList = ({ navItems }: NavListProps) => {
  const { t } = useTranslation();
  const navList = useMemo(() => Object.keys(navItems), []);

  return (
    <>
      {navList.map((k) => (
        <NavLink key={k} to={(navItems as any)[k]}>
          {t(`nav.${k}`)}
        </NavLink>
      ))}
    </>
  );
};
