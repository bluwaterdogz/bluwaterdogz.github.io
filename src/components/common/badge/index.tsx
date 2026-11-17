import styles from "./styles.module.scss";

interface BadgeProps  extends React.HTMLAttributes<HTMLSpanElement> {
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
    onClick={props.onClick}
    className={`${styles.badge} ${className}`}
  >
    {children}
  </span>
);
