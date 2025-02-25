import Service from "../default/Service";
import JobClient from "./JobClient";
import { Job } from "./types";

const jobService = new Service<Job, typeof JobClient>(JobClient);
export default jobService;
