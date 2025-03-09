import "./styles/styles.scss";
import "./styles/theme.scss";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import zh from "./i18n/zh.json";
import de from "./i18n/de.json";
import ko from "./i18n/ko.json";
import th from "./i18n/th.json";

i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
    zh,
    de,
    ko,
    th,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const root = document.getElementById("root");
document.querySelector("html")!.classList.add("theme-light");

ReactDOM.createRoot(root!).render(<RouterProvider router={router} />);
