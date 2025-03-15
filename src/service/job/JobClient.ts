import Client from "../default/Client";
import { jobs } from "./data";
import { Job } from "./types";

const JobClient = new Client<Job>({
  fallbackData: jobs,
  path: "/jobs",
});
export default JobClient;
