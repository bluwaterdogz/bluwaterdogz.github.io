import { CSSProperties } from "react";
import styles from "./styles.module.scss";

export interface CollaborationRegion {
  iconUrl: string;
  label: string;
}

interface CollaborationRegionsProps {
  heading: string;
  regions: CollaborationRegion[];
  summary: string;
  stats: string[];
}

export const CollaborationRegions = ({
  heading,
  regions,
  summary,
  stats,
}: CollaborationRegionsProps) => {
  return (
    <aside className={styles.regions}>
      <h3>{heading}</h3>
      <div className={styles.headingRule} />
      <ul>
        {regions.map((region) => (
          <li key={region.label}>
            <span
              aria-hidden="true"
              className={styles.regionIcon}
              style={
                {
                  "--region-icon": `url(${region.iconUrl})`,
                } as CSSProperties
              }
            >
              <img alt="" src={region.iconUrl} />
            </span>
            <span>{region.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.summary}>
        <i className="fa fa-users" aria-hidden="true" />
        <p>{summary}</p>
      </div>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <span key={stat}>{stat}</span>
        ))}
      </div>
    </aside>
  );
};
