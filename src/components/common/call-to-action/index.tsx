import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

interface CallToActionProps {
  description: string;
  icon?: string;
  label: string;
  title: string;
  to: string;
}

export const CallToAction = ({
  description,
  icon = "fa fa-magic",
  label,
  title,
  to,
}: CallToActionProps) => {
  return (
    <aside className={styles.callToAction}>
      <div className={styles.icon} aria-hidden="true">
        <i className={icon} />
      </div>
      <div className={styles.copy}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link className={styles.link} to={to}>
        {label}
        <span aria-hidden="true">&#8594;</span>
      </Link>
    </aside>
  );
};
