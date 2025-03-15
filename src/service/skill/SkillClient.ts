import Client from "../default/Client";
import { skills } from "./data";
import { Skill } from "./types";

const skillClient = new Client<Skill>({
  fallbackData: skills,
  path: "/skills",
});
export default skillClient;
