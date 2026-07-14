import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface PageHeadingProps {
  children?: ReactNode;
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  eyebrow: ReactNode;
  title: ReactNode;
}

export const PageHeading = ({
  children,
  className = "",
  description,
  descriptionClassName = "",
  eyebrow,
  title,
}: PageHeadingProps) => (
  <div className={`${styles.heading} ${className}`}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h1>{title}</h1>
    {description != null && (
      <p className={`${styles.description} ${descriptionClassName}`}>
        {description}
      </p>
    )}
    {children}
  </div>
);
