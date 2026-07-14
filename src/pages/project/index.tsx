import { Navigate, useParams } from "react-router-dom";
import { Project } from "../../components/project";

export const ProjectPage = () => {
  const { id } = useParams();
  if (id == null) {
    return <Navigate replace to="/404" />;
  }
  return <Project id={id} />;
};
