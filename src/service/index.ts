import { createContext, useContext } from "react";
import jobService from "./job/JobService";
import skillService from "./skills/SkillService";

export interface ServiceContextI {
  jobService: typeof jobService;
  skillService: typeof skillService;
}

export const serviceContextValue: ServiceContextI = {
  jobService,
  skillService,
};

const ServiceContext = createContext<ServiceContextI>(serviceContextValue);

export const useServiceContext = () => useContext(ServiceContext);

export default ServiceContext;
