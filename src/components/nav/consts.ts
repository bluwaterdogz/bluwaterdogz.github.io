import { NavItem } from "./types";

export const navItems: NavItem[] = [
  { key: "home", to: "/" },
  { key: "skills", to: "/skills" },
  {
    activePathPrefixes: ["/projects", "/project/"],
    key: "projects",
    to: "/projects",
  },
  { key: "about", to: "/about" },
];
