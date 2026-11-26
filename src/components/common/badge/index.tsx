import styles from "./styles.module.scss";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  ariaLabel?: string;
  className?: string;
}

export const Badge = ({
  ariaLabel,
  children,
  className = "",
  ...props
}: BadgeProps) => (
  <span
    aria-label={ariaLabel}
    className={`${styles.badge} ${className}`}
    {...props}
  >
    {children}
  </span>
);
