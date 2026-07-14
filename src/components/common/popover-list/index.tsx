import { Link } from "react-router-dom";

interface PopoverItem {
  id: string;
  label: string;
  to: string;
}

interface PopoverListProps {
  className?: string;
  items: PopoverItem[];
  label: string;
}

export const PopoverList = ({
  className = "",
  items,
  label,
}: PopoverListProps) => (
  <div className={className}>
    <p>{label}</p>
    {items.map((item) => (
      <Link key={item.id} to={item.to}>
        {item.label}
        <span aria-hidden="true">&#8594;</span>
      </Link>
    ))}
  </div>
);
