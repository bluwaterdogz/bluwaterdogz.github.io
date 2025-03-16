import { ProjectContent } from "./project-content";
import { ProjectHeader } from "./project-header";
import { useProjectStore } from "../../service/project/ProjectStore";
import { useEffect } from "react";
import { Loader } from "../common/loader";

interface ProjectProps {
  id: string;
}
export const Project = ({ id }: ProjectProps) => {
  const { project, fetchProject, loading } = useProjectStore();

  useEffect(() => {
    fetchProject(id!);
  }, [fetchProject]);

  return (
    <>
      {loading || project == null ? (
        <Loader />
      ) : (
        <>
          <ProjectHeader project={project} />
          <ProjectContent project={project} />
        </>
      )}
    </>
  );
};
