import type { Preview } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router";

import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import en from "../src/i18n/en.json";
import es from "../src/i18n/es.json";
import zh from "../src/i18n/zh.json";
import de from "../src/i18n/de.json";
import ko from "../src/i18n/ko.json";
import th from "../src/i18n/th.json";

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
