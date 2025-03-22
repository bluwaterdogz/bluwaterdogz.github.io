import { HTMLProps } from "react";
import styles from "./styles.module.scss";
interface InputProps extends HTMLProps<HTMLInputElement> {}
export const Input = (props: InputProps) => {
  const { className, label, ...rest } = props;
  return (
    <div className={`${className} ${styles.input}`}>
      <input {...rest} />
      {label && <label>{label}</label>}
    </div>
  );
};
