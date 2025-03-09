import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/home";
import { SkillsPage } from "../pages/skills";
import { ProjectsPage } from "../pages/projects";
import { NotFoundPage } from "../pages/404";
import { ProjectPage } from "../pages/project";
import { DefaultLayout } from "../layouts/default";
import { AboutPage } from "../pages/about";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/skills",
        element: <SkillsPage />,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      {
        path: "/project/:id",
        element: <ProjectPage />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
