import { Link } from "react-router";
import { Job } from "../../../service/job/types";
import styles from "./styles.module.scss";

interface JobItemProos {
  job: Job;
}

export const JobItem = ({ job }: JobItemProos) => {
  return (
    <div className={styles.jobItem}>
      <div className={styles.content}>
        <Link to={`/job/${job.id}`}>
          <img
            src={job.logoImg}
            className={styles.jobImage}
            alt={job.companyName}
          />
        </Link>
      </div>
    </div>
  );
};
