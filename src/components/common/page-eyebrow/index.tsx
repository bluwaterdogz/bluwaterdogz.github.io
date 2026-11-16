import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface PageEyebrowProps {
  children: ReactNode;
  className?: string;
}

export const PageEyebrow = ({
  children,
  className = "",
}: PageEyebrowProps) => (
  <p className={`${styles.pageEyebrow} ${className}`}>{children}</p>
);
