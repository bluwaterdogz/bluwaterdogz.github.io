import { useTranslation } from "react-i18next";
import { NavLink } from "../nav-link";
import { NavItem } from "../types";
interface NavListProps {
  navItems: NavItem[];
}
export const NavList = ({ navItems }: NavListProps) => {
  const { t } = useTranslation();

  return (
    <>
      {navItems.map((item) => (
        <NavLink
          activePathPrefixes={item.activePathPrefixes}
          key={item.key}
          to={item.to}
        >
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </>
  );
};
