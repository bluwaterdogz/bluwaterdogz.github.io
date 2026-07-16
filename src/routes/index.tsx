import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/home";
import { SkillsPage } from "../pages/skills";
import { ProjectsPage } from "../pages/projects";
import { NotFoundPage } from "../pages/404";
import { ProjectPage } from "../pages/project";
import { DefaultLayout } from "../layouts/default";
import { AboutPage } from "../pages/about";
import { MicroappsPage } from "../pages/microapps";
import { microapps } from "../pages/microapps/registry";
import { PlaceholderPage } from "../pages/placeholder";
import { Loader } from "../components/common/loader";

const renderLazyMicroapp = (Component: (typeof microapps)[number]["Component"]) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
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
        path: "/microapps",
        element: <MicroappsPage />,
      },
      ...microapps.map((app) => ({
        path: app.href,
        element: renderLazyMicroapp(app.Component),
      })),
      {
        path: "/background-animation",
        element: <PlaceholderPage />,
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
