import Service from "../default/Service";
import projectClient from "./ProjectClient";
import { Project } from "./types";

const projectService = new Service<Project, typeof projectClient>(
  projectClient
);
export default projectService;
