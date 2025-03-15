import Client from "../default/Client";
import { skillTypes } from "./data";
import { SkillType } from "./types";

const skillTypeClient = new Client<SkillType>({
  fallbackData: skillTypes,
  path: "/skill-types",
});
export default skillTypeClient;
