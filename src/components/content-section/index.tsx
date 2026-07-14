import { ReactNode } from "react";
import { AnimationOnScroll } from "react-animation-on-scroll";

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
      <AnimationOnScroll
        animateIn="animate__fadeInRight"
        animateOnce={true}
        duration={0.6}
      >
        <div className={contentClassName}>{children}</div>
      </AnimationOnScroll>
    </section>
  );
};
