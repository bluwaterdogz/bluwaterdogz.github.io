import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const PageShell = ({
  children,
  className = "",
  contentClassName = "",
}: PageShellProps) => (
  <main className={`${styles.page} ${className}`}>
    <div className={`${styles.container} ${contentClassName}`}>{children}</div>
  </main>
);
