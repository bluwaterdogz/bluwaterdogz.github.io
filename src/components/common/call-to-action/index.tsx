import { linkedinProfileUrl } from "../../../service/consts";
import styles from "./styles.module.scss";

interface CallToActionProps {
  description: string;
  icon?: string;
  label: string;
  title: string;
}

export const CallToAction = ({
  description,
  icon = "fa fa-magic",
  label,
  title,
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
      <a
        className={styles.link}
        href={linkedinProfileUrl}
        rel="noreferrer"
        target="_blank"
      >
        {label}
        <span aria-hidden="true">&#8594;</span>
      </a>
    </aside>
  );
};
