import type { ComponentType, LazyExoticComponent } from "react";
import { lazy } from "react";

type MicroappModule = {
  default: ComponentType;
};

export type MicroappDefinition = {
  id: string;
  title: string;
  description: string;
  href: string;
  Component: LazyExoticComponent<ComponentType>;
};

const defineMicroapp = (
  definition: Omit<MicroappDefinition, "Component"> & {
    load: () => Promise<MicroappModule>;
  },
): MicroappDefinition => {
  const { load, ...metadata } = definition;

  return {
    ...metadata,
    Component: lazy(load),
  };
};

export const microapps = [
  defineMicroapp({
    id: "thai-flashcards",
    title: "Thai Learning Flashcards",
    description:
      "Practice Thai letters and sounds with grouped study sets, custom selection, and memorization tracking.",
    href: "/microapps/thai-flashcards",
    load: () => import("./thai_flashcard_app"),
  }),
  defineMicroapp({
    id: "todo",
    title: "Todo App",
    description:
      "Organize tasks with categories, subtasks, drag-and-drop ordering, and local storage persistence.",
    href: "/microapps/todo",
    load: () => import("./todo_app_localstorage_drag_categories"),
  }),
  defineMicroapp({
    id: "golf-stroke-counter",
    title: "Golf Stroke Counter",
    description:
      "Track strokes while you play, start new holes, and view per-hole + total scoring after completion.",
    href: "/microapps/golf-stroke-counter",
    load: () => import("./golf_stroke_counter"),
  }),
    defineMicroapp({
    id: "chameleon",
    title: "Chameleon",
    description:
      "Chameleon",
    href: "/microapps/chameleon",
    load: () => import("./chameleon"),
  }),
] satisfies MicroappDefinition[];
