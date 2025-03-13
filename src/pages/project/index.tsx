import { useNavigate, useParams } from "react-router-dom";
import { Project } from "../../components/project";

export const ProjectPage = () => {
  const { id } = useParams();
  if (id == null) {
    const navigate = useNavigate();
    navigate("/404");
    return <></>;
  }
  return <Project id={id} />;
};
