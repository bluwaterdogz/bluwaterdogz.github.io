import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  JobTimeline,
  JobTimelineItem,
} from "../../components/home/job-timeline";

const processSteps = [
  { icon: "fa fa-crosshairs", key: "align", number: "01" },
  { icon: "fa fa-sitemap", key: "map", number: "02" },
  { icon: "fa fa-lightbulb-o", key: "shape", number: "03" },
  { icon: "fa fa-code", key: "build", number: "04" },
  { icon: "fa fa-shield", key: "verify", number: "05" },
  { icon: "fa fa-line-chart", key: "improve", number: "06" },
] as const;

interface ProcessTimelineProps {
  className?: string;
}

export const ProcessTimeline = ({ className }: ProcessTimelineProps) => {
  const { t } = useTranslation();
  const items = useMemo<JobTimelineItem[]>(
    () =>
      processSteps.map(({ icon, key, number }) => ({
        company: t(`about.process.steps.${key}.title`),
        icon,
        number,
        summary: t(`about.process.steps.${key}.description`),
      })),
    [t]
  );

  return <JobTimeline className={className} items={items} />;
};
