import "./styles/styles.scss";
import "./styles/theme.scss";
import "animate.css/animate.min.css";
import "font-awesome/css/font-awesome.min.css";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import HttpBackend from "i18next-http-backend";

i18n.use(HttpBackend).use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  interpolation: {
    escapeValue: false,
  },
}).then(() => {
  const root = document.getElementById("root");
  document.querySelector("html")!.classList.add("theme-light");

  ReactDOM.createRoot(root!).render(<RouterProvider router={router} />);
});
