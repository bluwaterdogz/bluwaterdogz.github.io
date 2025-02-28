import { createContext, useContext } from "react";
import jobService from "./job/JobService";
import skillService from "./skill/SkillService";
import projectService from "./project/ProjectService";

export interface ServiceContextI {
  jobService: typeof jobService;
  skillService: typeof skillService;
  projectService: typeof projectService;
}

export const serviceContextValue: ServiceContextI = {
  jobService,
  skillService,
  projectService,
};

const ServiceContext = createContext<ServiceContextI>(serviceContextValue);

export const useServiceContext = () => useContext(ServiceContext);

export default ServiceContext;
