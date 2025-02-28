import Service from "../default/Service";
import SkillClient from "./SkillClient";
import { Skill } from "./types";

const skillService = new Service<Skill, typeof SkillClient>(SkillClient);
export default skillService;
