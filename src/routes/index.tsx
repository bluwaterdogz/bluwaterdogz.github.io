import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/home";
import { PlaceholderPage } from "../pages/placeholder";
import { SkillsPage } from "../pages/skills";
import { ProjectsPage } from "../pages/projects";
import { NotFoundPage } from "../pages/404";
import { ProjectPage } from "../pages/project";
import { DefaultLayout } from "../layouts/default";
import { AboutPage } from "../pages/about";
import { JobsPage } from "../pages/jobs";
import { JobPage } from "../pages/job";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <PlaceholderPage />,
  },
  {
    path: "/home",
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
        path: "/Jobs",
        element: <JobsPage />,
      },
      {
        path: "/Jobs/:id",
        element: <JobPage />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
