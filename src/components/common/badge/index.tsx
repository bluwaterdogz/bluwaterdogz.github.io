import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface BadgeProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
}

export const Badge = ({
  ariaLabel,
  children,
  className = "",
}: BadgeProps) => (
  <span
    aria-label={ariaLabel}
    className={`${styles.badge} ${className}`}
  >
    {children}
  </span>
);
