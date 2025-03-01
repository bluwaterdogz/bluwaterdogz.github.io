import { ReactNode } from "react";

export interface Project {
  name: string;
  id: string;
  description?: string;
  img?: string;
  content: ReactNode[];
  skills: string[];
}
