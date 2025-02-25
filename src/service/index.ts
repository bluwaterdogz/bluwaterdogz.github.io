import { createContext, useContext } from "react";
import jobService from "./job/JobService";

export interface ServiceContextI {
  jobService: typeof jobService;
}

export const serviceContextValue: ServiceContextI = {
  jobService,
};

const ServiceContext = createContext<ServiceContextI>(serviceContextValue);

export const useServiceContext = () => useContext(ServiceContext);

export default ServiceContext;
