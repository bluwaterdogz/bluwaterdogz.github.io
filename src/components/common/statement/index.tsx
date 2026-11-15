import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface StatementProps {
  as?: "blockquote" | "p";
  children: ReactNode;
  className?: string;
}

export const Statement = ({
  as: Element = "p",
  children,
  className = "",
}: StatementProps) => (
  <Element className={`${styles.statement} ${className}`}>{children}</Element>
);
