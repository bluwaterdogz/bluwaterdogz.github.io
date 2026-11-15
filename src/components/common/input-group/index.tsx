import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface InputGroupProps {
  children: ReactNode;
  className?: string;
  label: string;
}

export const InputGroup = ({ children, className, label }: InputGroupProps) => (
  <div className={[styles.inputGroup, className].filter(Boolean).join(" ")}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);
