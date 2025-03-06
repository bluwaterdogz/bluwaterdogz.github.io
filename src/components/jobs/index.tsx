import { useEffect } from "react";
import { useJobStore } from "../../service/job/JobStore";
import { Loader } from "../common/loader";

export const Jobs = () => {
  const { jobList, loadingList, fetchJobList } = useJobStore();

  useEffect(() => {
    fetchJobList();
  }, [fetchJobList]);

  return (
    <>
      {loadingList ? (
        <Loader />
      ) : (
        jobList.map((job) => {
          return <p key={job.id}> {job.companyName}</p>;
        })
      )}
    </>
  );
};
