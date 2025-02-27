import Client from "../default/Client";
import { skills } from "./skills";
import { SkillSection } from "./types";

const JobClient = new Client<SkillSection>({ listData: skills });

export default JobClient;
