import { Link } from "react-router-dom";
import { ProjectEmployer } from "../../../service/project/types";
import styles from "./styles.module.scss";

export interface JobTimelineItem {
  company: string;
  employer?: ProjectEmployer;
  icon?: string;
  number?: string;
  period?: string;
  summary: string;
}

interface TimelineEntryProps {
  item: JobTimelineItem;
}

const TimelineEntry = ({ item }: TimelineEntryProps) => {
  const content = (
    <>
      {item.period != null && <p className={styles.period}>{item.period}</p>}
      <h4>{item.company}</h4>
      <p className={styles.summary}>{item.summary}</p>
      {item.icon != null && (
        <i className={`${styles.itemIcon} ${item.icon}`} aria-hidden="true" />
      )}
    </>
  );

  return item.employer != null ? (
    <Link className={styles.entryContent} to={`/projects?job=${item.employer}`}>
      {content}
    </Link>
  ) : (
    <div className={styles.entryContent}>{content}</div>
  );
};

interface JobTimelineProps {
  className?: string;
  heading?: string;
  items: JobTimelineItem[];
  variant?: "default" | "light";
}

export const JobTimeline = ({
  className = "",
  heading,
  items,
  variant = "default",
}: JobTimelineProps) => {
  const hasNumbers = items.some((item) => item.number != null);

  return (
    <aside
      className={`${styles.timeline} ${
        variant === "light" ? styles.light : ""
      } ${className}`}
    >
      {heading != null && <h3>{heading}</h3>}
      <ol className={hasNumbers ? styles.numbered : undefined}>
        {items.map((item) => (
          <li key={`${item.period ?? item.number}-${item.company}`}>
            {item.number != null && (
              <span className={styles.number} aria-hidden="true">
                {item.number}
              </span>
            )}
            <span className={styles.marker} aria-hidden="true" />
            <TimelineEntry item={item} />
          </li>
        ))}
      </ol>
    </aside>
  );
};
