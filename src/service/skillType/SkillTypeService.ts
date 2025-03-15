import Service from "../default/Service";
import SkillClient from "./SkillTypeClient";
import { SkillType } from "./types";

const skillTypeService = new Service<SkillType, typeof SkillClient>(
  SkillClient
);
export default skillTypeService;
