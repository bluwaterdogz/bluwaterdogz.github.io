import "./styles/styles.scss";
import "./styles/theme.scss";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import ServiceContext, { serviceContextValue } from "./service/index.ts";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import en from "./i18n/en.json";
import es from "./i18n/es.json";
import zh from "./i18n/zh.json";
import de from "./i18n/de.json";
import ko from "./i18n/ko.json";
import th from "./i18n/th.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en,
      es,
      zh,
      de,
      ko,
      th,
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

const root = document.getElementById("root");
document.querySelector("html")!.classList.add("theme-light");

ReactDOM.createRoot(root!).render(
  <ServiceContext.Provider value={serviceContextValue}>
    <RouterProvider router={router} />
  </ServiceContext.Provider>
);
