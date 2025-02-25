import "./styles/styles.scss";
import "./styles/theme.scss";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import ServiceContext, { serviceContextValue } from "./service/index.ts";

const root = document.getElementById("root");
document.querySelector("html")!.classList.add("theme-light");

ReactDOM.createRoot(root!).render(
  <ServiceContext.Provider value={serviceContextValue}>
    <RouterProvider router={router} />
  </ServiceContext.Provider>
);
