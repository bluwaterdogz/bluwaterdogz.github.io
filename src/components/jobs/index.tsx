import { useEffect } from "react";
import { useJobStore } from "../../service/job/JobStore";
import { Loader } from "../common/loader";
import { JobItem } from "./job-item";
import styles from "./styles.module.scss";

export const Jobs = () => {
  const { jobList, loadingList, fetchJobList } = useJobStore();

  useEffect(() => {
    fetchJobList();
  }, [fetchJobList]);

  return (
    <div className={styles.jobList}>
      <video
        src="/imgs/forest.mp4"
        autoPlay={true}
        // playsinline={true}
        muted
        loop
        className={styles.video}
      ></video>

      <div className={styles.listContainer}>
        {loadingList ? (
          <Loader />
        ) : (
          jobList
            .filter((j) => j.active)
            .map((job) => <JobItem key={job.id} job={job} />)
        )}
      </div>
    </div>
  );
};
