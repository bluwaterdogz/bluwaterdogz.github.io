import Client from "../default/Client";
import { jobs } from "./data";
import { Job } from "./types";

const JobClient = new Client<Job>({ listData: jobs });
export default JobClient;
