import Service from "../default/Service";
import SkillClient from "./SkillClient";
import { SkillSection } from "./types";

const skillService = new Service<SkillSection, typeof SkillClient>(SkillClient);
export default skillService;
