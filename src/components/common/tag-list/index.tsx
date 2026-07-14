interface TagItem {
  id: string;
  label: string;
}

interface TagListProps {
  ariaLabel: string;
  className?: string;
  items: TagItem[];
}

export const TagList = ({
  ariaLabel,
  className = "",
  items,
}: TagListProps) => (
  <ul aria-label={ariaLabel} className={className}>
    {items.map((item) => (
      <li key={item.id}>{item.label}</li>
    ))}
  </ul>
);
