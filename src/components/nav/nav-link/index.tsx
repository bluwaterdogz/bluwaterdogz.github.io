import React from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

interface NavLinkProps extends LinkProps {
  activePathPrefixes?: string[];
}

export const NavLink: React.FunctionComponent<NavLinkProps> = (props) => {
  const location = useLocation();
  const destination = String(props.to);
  const { activePathPrefixes = [destination], ...linkProps } = props;
  const isActive =
    location.pathname === destination ||
    (destination !== "/" &&
      activePathPrefixes.some((prefix) =>
        location.pathname.startsWith(prefix)
      ));
  const className = isActive ? styles.active : "";

  return (
    <Link
      {...linkProps}
      aria-current={isActive ? "page" : undefined}
      className={`${props.className ?? ""} ${className}`}
    >
      {props.children}
    </Link>
  );
};
