import type { Preview } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router";

import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import de from "../public/locales/de/translation.json";
import en from "../public/locales/en/translation.json";
import es from "../public/locales/es/translation.json";
import et from "../public/locales/et/translation.json";
import ja from "../public/locales/ja/translation.json";
import ko from "../public/locales/ko/translation.json";
import no from "../public/locales/no/translation.json";
import pt from "../public/locales/pt/translation.json";
import sv from "../public/locales/sv/translation.json";
import th from "../public/locales/th/translation.json";
import zh from "../public/locales/zh/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
    et,
    ja,
    zh,
    de,
    ko,
    no,
    pt,
    sv,
    th,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const preview: Preview = {
  parameters: {
    features: {
      backgroundsStoryGlobals: true,
    },
    stories: [
      "../src/**/*.mdx",
      "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
      "../src/**/story.@(js|jsx|mjs|ts|tsx)",
    ],
    controls: {
      matchers: {
        date: /Date$/i,
      },
    },
  },
};

export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];

export default preview;
