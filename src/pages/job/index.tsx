import { useEffect } from "react";
import { useJobStore } from "../../service/job/JobStore";
import { Loader } from "../../components/common/loader";
import { useTranslation } from "react-i18next";

interface JobPageProps {
  id: string;
}

export const JobPage = ({ id }: JobPageProps) => {
  const { job, loading, fetchJob } = useJobStore();
  const { t } = useTranslation();
  useEffect(() => {
    fetchJob(id);
  }, [fetchJob]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        job != null && (
          <>
            <h2>{job.companyName}</h2>
            <p>{t(`data.jobs.title.${job.id}`)}</p>
          </>
        )
      )}
    </>
  );
};
