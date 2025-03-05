import React from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

export const NavLink: React.FunctionComponent<LinkProps> = (
  props: LinkProps
) => {
  const location = useLocation();
  const isActive = location.pathname === props.to;
  const className = isActive ? styles.active : "";

  return (
    <Link className={`${props.className} ${className}`} {...props}>
      {props.children}
    </Link>
  );
};
