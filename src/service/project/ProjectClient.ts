import Client from "../default/Client";
import { projects } from "./data";
import { Project } from "./types";

const projectClient = new Client<Project>({
  fallbackData: projects,
  path: "/projects",
});
export default projectClient;
