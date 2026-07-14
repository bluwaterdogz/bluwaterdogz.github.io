import styles from "./styles.module.scss";

export interface FeatureListItem {
  icon: string;
  value: string;
  label: string;
}

interface FeatureListProps {
  items: FeatureListItem[];
}

export const FeatureList = ({ items }: FeatureListProps) => {
  return (
    <ul className={styles.featureList}>
      {items.map((item) => (
        <li className={styles.item} key={item.label}>
          <i className={`fa ${item.icon}`} aria-hidden="true" />
          <div>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};
