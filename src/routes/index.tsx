import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/home";
import { Placeholder } from "../pages/placeholder";
import Skills from "../components/skills";
// import App from "../App";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Placeholder />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/skills",
    element: <Skills />,
  },
]);
