import { ProjectStory } from "./types";

export const projectStories: Record<string, ProjectStory> = {
  "1": {
    bodyLayout: "cards",
    heroLayout: "split",
    sections: [
      { id: "overview", type: "text" },
      {
        id: "contributions",
        nodes: ["features", "integrations", "testing", "delivery"],
        type: "architecture",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "2": {
    bodyLayout: "cards",
    heroLayout: "split",
    sections: [
      { id: "overview", type: "text" },
      {
        id: "contributions",
        nodes: ["leadership", "discovery", "realtime", "modernization"],
        type: "architecture",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "3": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "4": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "5": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "6": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "7": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "8": {
    bodyLayout: "concise",
    heroLayout: "split",
    sections: [{ id: "overview", type: "text" }],
  },
  "9": {
    bodyLayout: "cards",
    heroLayout: "split",
    sections: [
      { id: "challenge", type: "challenge" },
      {
        id: "architecture",
        nodes: ["interface", "api", "search", "exports"],
        type: "architecture",
      },
      {
        id: "progression",
        steps: ["discover", "connect", "interact", "export", "validate"],
        type: "timeline",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "10": {
    bodyLayout: "timeline",
    heroLayout: "stacked",
    sections: [
      { id: "challenge", type: "challenge" },
      {
        id: "pipeline",
        steps: [
          "ingest",
          "normalize",
          "dedupe",
          "classify",
          "persist",
          "recover",
        ],
        type: "timeline",
      },
      {
        id: "architecture",
        nodes: ["urls", "services", "serverless", "diagnostics"],
        type: "architecture",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "11": {
    bodyLayout: "timeline",
    heroLayout: "stacked",
    sections: [
      { id: "challenge", type: "challenge" },
      {
        id: "architecture",
        nodes: ["platforms", "resolution", "pipelines", "workflows"],
        type: "architecture",
      },
      {
        id: "progression",
        steps: ["connect", "reconcile", "sync", "present"],
        type: "timeline",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "12": {
    bodyLayout: "cards",
    heroLayout: "stacked",
    sections: [
      {
        id: "architecture",
        nodes: ["frontend", "apis", "pipelines", "infrastructure"],
        type: "architecture",
      },
      {
        id: "progression",
        steps: ["identify", "improve", "release", "monitor"],
        type: "timeline",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
  "13": {
    bodyLayout: "cards",
    heroLayout: "stacked",
    sections: [
      { id: "challenge", type: "challenge" },
      {
        id: "architecture",
        nodes: ["tokens", "patterns", "integration", "coverage"],
        type: "architecture",
      },
      {
        id: "progression",
        steps: ["audit", "systemize", "integrate", "validate"],
        type: "timeline",
      },
      { id: "outcome", type: "outcome" },
    ],
  },
};
