import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LinkedCardProps {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  to: string;
}

export const LinkedCard = ({
  ariaLabel,
  children,
  className = "",
  to,
}: LinkedCardProps) => (
  <Link aria-label={ariaLabel} className={className} to={to}>
    {children}
  </Link>
);
