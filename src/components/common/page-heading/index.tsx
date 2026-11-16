import { ReactNode } from "react";
import { PageEyebrow } from "../page-eyebrow";
import styles from "./styles.module.scss";

interface PageHeadingProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  eyebrow: ReactNode;
  title: ReactNode;
}

export const PageHeading = ({
  children,
  className = "",
  contentClassName = "",
  description,
  descriptionClassName = "",
  eyebrow,
  title,
}: PageHeadingProps) => (
  <div className={`${styles.heading} ${className}`}>
    <PageEyebrow>{eyebrow}</PageEyebrow>
    <div className={contentClassName}>
      <h1>{title}</h1>
      {description != null && (
        <p className={`${styles.description} ${descriptionClassName}`}>
          {description}
        </p>
      )}
      {children}
    </div>
  </div>
);
