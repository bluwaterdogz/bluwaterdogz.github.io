import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "../pages/home";
import { SkillsPage } from "../pages/skills";
import { ProjectsPage } from "../pages/projects";
import { NotFoundPage } from "../pages/404";
import { ProjectPage } from "../pages/project";
import { DefaultLayout } from "../layouts/default";
import { AboutPage } from "../pages/about";
import { MicroappsPage } from "../pages/microapps";
import ThaiFlashcardApp from "../pages/microapps/thai_flashcard_app";
import TodoApp from "../pages/microapps/todo_app_localstorage_drag_categories";
import GolfStrokeCounterApp from "../pages/microapps/golf_stroke_counter";
import { PlaceholderPage } from "../pages/placeholder";

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
      {
        path: "/microapps/thai-flashcards",
        element: <ThaiFlashcardApp />,
      },
      {
        path: "/microapps/todo",
        element: <TodoApp />,
      },
      {
        path: "/microapps/golf-stroke-counter",
        element: <GolfStrokeCounterApp />,
      },
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
