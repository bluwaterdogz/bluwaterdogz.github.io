import Client from "../default/Client";
import { projects } from "./data";
import { Project } from "./types";

const projectClient = new Client<Project>({ listData: projects });
export default projectClient;
