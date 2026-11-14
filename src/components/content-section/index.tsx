import { ReactNode } from "react";

interface ContentSectionProps {
  id: string;
  sectionClassName: string;
  contentClassName: string;
  children: ReactNode;
}

export const ContentSection = ({
  id,
  sectionClassName,
  contentClassName,
  children,
}: ContentSectionProps) => {
  return (
    <section className={sectionClassName} id={id}>
      <div className={contentClassName}>{children}</div>
    </section>
  );
};
