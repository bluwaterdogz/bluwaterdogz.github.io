import { ProjectStory } from "./types";

export const mobianStories: Record<string, ProjectStory> = {
  "9": {
    accent: "data",
    kicker: "Making audience intelligence searchable",
    summary:
      "A connected search experience spanning interactive interfaces, APIs, indexes, caches, and exports.",
    sections: [
      {
        type: "challenge",
        eyebrow: "The challenge",
        title: "Complex audience data needed to feel immediate",
        content:
          "Advertisers needed to discover, analyze, and act on dense audience and channel data without understanding the systems behind it. Search behavior had to remain consistent across filtering, pagination, historical reporting, and exports.",
      },
      {
        type: "architecture",
        title: "One search contract across the stack",
        nodes: [
          { label: "React + Next.js", detail: "Autocomplete, infinite scroll, date filters" },
          { label: "FastAPI", detail: "Pagination and query contracts" },
          { label: "PostgreSQL + OpenSearch", detail: "Historical data and indexed discovery" },
          { label: "Redis + streaming exports", detail: "Fast reads and filter-aware CSV output" },
        ],
      },
      {
        type: "timeline",
        title: "Engineering progression",
        steps: [
          {
            label: "Discover",
            title: "Define the audience workflow",
            content: "I translated advertiser discovery needs into consistent requirements for search, filtering, pagination, historical reporting, and exports.",
          },
          {
            label: "Connect",
            title: "Join APIs, indexes, and data stores",
            content: "I coordinated FastAPI services, PostgreSQL queries, OpenSearch indexes, and Redis caching behind a shared search contract.",
          },
          {
            label: "Interact",
            title: "Make discovery feel immediate",
            content: "I built server-side autocomplete, infinite scrolling, date filtering, channel statistics, and responsive result states in React and Next.js.",
          },
          {
            label: "Export",
            title: "Carry user context into exports",
            content: "Streaming CSV exports preserved the active search and filter parameters instead of becoming a disconnected workflow.",
          },
          {
            label: "Validate",
            title: "Test the full experience",
            content: "I verified behavior across the interface, API boundaries, search infrastructure, and data services so each path produced consistent results.",
          },
        ],
      },
      {
        type: "outcome",
        title: "Audience intelligence became a workflow",
        content:
          "The result connected discovery, analysis, and export into one coherent experience, with the same active search context preserved from the interface through backend processing.",
      },
    ],
  },
  "10": {
    accent: "throughput",
    kicker: "Keeping high-volume contextual data reliable",
    summary:
      "A recovery-aware ingestion system for normalizing, classifying, and diagnosing contextual data at production scale.",
    sections: [
      {
        type: "challenge",
        eyebrow: "The reliability problem",
        title: "Messy URLs become expensive at scale",
        content:
          "Duplicate URLs, incomplete metadata, asynchronous jobs, and inconsistent classifications compound quickly. The work focused on making every stage observable and recoverable rather than treating ingestion as a single request.",
      },
      {
        type: "timeline",
        title: "The context pipeline",
        steps: [
          { label: "Ingest", title: "Receive contextual inputs", content: "I developed tooling that accepted webpage, video, and channel inputs across asynchronous processing paths." },
          { label: "Normalize", title: "Create stable URL identities", content: "URL parsing, normalization, aliases, and fallbacks turned inconsistent inputs into comparable records." },
          { label: "Dedupe", title: "Reconcile repeated work", content: "Deduplication and alias reconciliation reduced redundant processing while preserving the correct canonical relationships." },
          { label: "Classify", title: "Apply consistent context", content: "Batch processing and downstream integrations carried normalized metadata into classification workflows." },
          { label: "Persist", title: "Save durable metadata", content: "I improved metadata persistence and checkpoints so completed work could be reused across services." },
          { label: "Recover", title: "Make failures diagnosable", content: "Retry behavior, checkpoints, and CloudWatch diagnostics made serverless failures easier to resume and investigate." },
        ],
      },
      {
        type: "architecture",
        title: "Reliability built into every handoff",
        nodes: [
          { label: "URL intelligence", detail: "Normalization, aliases, parsing, fallbacks" },
          { label: "Python services", detail: "Batch processing and metadata persistence" },
          { label: "AWS serverless", detail: "Lambda and SQS orchestration" },
          { label: "CloudWatch diagnostics", detail: "Checkpoints, retries, and failure investigation" },
        ],
      },
      {
        type: "outcome",
        title: "Throughput without losing traceability",
        content:
          "The tooling made high-volume processing easier to resume, diagnose, and reconcile across multiple Python services, serverless functions, storage systems, and downstream consumers.",
      },
    ],
  },
  "11": {
    accent: "integration",
    kicker: "Connecting fragmented advertising data",
    summary:
      "Entity reconciliation and reporting workflows that made different ad platforms behave like one product.",
    sections: [
      {
        type: "challenge",
        eyebrow: "The integration gap",
        title: "Different platforms described the same business differently",
        content:
          "FreeWheel and Google Ad Manager used different identifiers, reporting structures, and naming conventions. Users still needed one predictable way to find advertisers, distinguish duplicates, map placements, and retrieve reporting data.",
      },
      {
        type: "architecture",
        title: "Reconcile before presenting",
        nodes: [
          { label: "External platforms", detail: "FreeWheel and Google Ad Manager" },
          { label: "Entity resolution", detail: "Source-qualified selections and duplicate disambiguation" },
          { label: "Data pipelines", detail: "Snowflake, Dagster, PostgreSQL, and reporting caches" },
          { label: "Product workflows", detail: "Search, galleries, mappings, and CSV exports" },
        ],
      },
      {
        type: "timeline",
        title: "Integration progression",
        steps: [
          { label: "Connect", title: "Integrate external ad systems", content: "I built advertiser and reporting-entity search across FreeWheel and Google Ad Manager data." },
          { label: "Reconcile", title: "Resolve entity differences", content: "Source-qualified selections and duplicate-name disambiguation preserved identity across platforms." },
          { label: "Sync", title: "Coordinate reporting data", content: "I improved reporting caches and the transformations connecting Snowflake, Dagster, and PostgreSQL workflows." },
          { label: "Present", title: "Build predictable product workflows", content: "Search, galleries, mappings, and exports gave users one consistent surface over fragmented sources." },
        ],
      },
      {
        type: "outcome",
        title: "A consistent surface over fragmented sources",
        content:
          "The resulting tools made advertising entities easier to navigate and targeting information easier to select while keeping source identity and reporting relationships explicit.",
      },
    ],
  },
  "12": {
    accent: "platform",
    kicker: "Making a multi-service platform more reliable",
    summary:
      "Cross-repository infrastructure, testing, observability, and release work for a production advertising platform.",
    sections: [
      {
        type: "architecture",
        title: "Reliability across service boundaries",
        nodes: [
          { label: "Frontend", detail: "Authenticated Cypress and initial Playwright coverage" },
          { label: "Application APIs", detail: "Authentication, contracts, and configuration fixes" },
          { label: "ETL + Persona", detail: "Reporting-cache synchronization and Python pipelines" },
          { label: "AWS infrastructure", detail: "Scheduled Lambda jobs, ingestion, and CloudWatch diagnostics" },
        ],
      },
      {
        type: "timeline",
        title: "Operational progression",
        steps: [
          { label: "Identify", title: "Trace issues across services", content: "I investigated failures across frontend, APIs, ETL, Persona, and AWS infrastructure rather than treating symptoms in isolation." },
          { label: "Improve", title: "Strengthen tests and infrastructure", content: "Authenticated Cypress coverage, initial Playwright tests, scheduled Lambda jobs, and configuration fixes reduced release risk." },
          { label: "Release", title: "Coordinate cross-repository delivery", content: "I aligned dependent changes and framework security updates across repositories and service boundaries." },
          { label: "Monitor", title: "Close the production feedback loop", content: "CloudWatch diagnostics and release follow-through made operational behavior visible after deployment." },
        ],
      },
      {
        type: "outcome",
        title: "Changes shipped as platform work, not isolated patches",
        content:
          "The work connected test coverage, serverless processing, framework security, service configuration, ETL synchronization, and coordinated releases across frontend and backend systems.",
      },
    ],
  },
  "13": {
    accent: "product",
    kicker: "Building consistent interfaces across a complex product",
    summary:
      "Reusable components and semantic design foundations that connected complex backend behavior to clear product interactions.",
    sections: [
      {
        type: "challenge",
        eyebrow: "The product challenge",
        title: "A growing analytics product needed a shared interface language",
        content:
          "Dashboards, tables, galleries, and search tools were evolving alongside new datasets and workflows. The interface needed reusable patterns that could absorb that complexity without making every feature feel different.",
      },
      {
        type: "architecture",
        title: "A system of reusable decisions",
        nodes: [
          { label: "Semantic tokens", detail: "Shared visual language and Material UI variants" },
          { label: "Interaction patterns", detail: "Autocomplete, filters, pagination, and loading states" },
          { label: "Data integration", detail: "Frontend API behavior translated into clear state" },
          { label: "Regression coverage", detail: "Jest, Cypress, and Playwright validation" },
        ],
      },
      {
        type: "timeline",
        title: "Design-system progression",
        steps: [
          { label: "Audit", title: "Find repeated UX problems", content: "I identified inconsistencies across dashboards, tables, galleries, search, filters, and loading states." },
          { label: "Systemize", title: "Build reusable interface patterns", content: "Semantic tokens, Material UI variants, and shared React components replaced one-off decisions." },
          { label: "Integrate", title: "Connect patterns to real data", content: "The components translated complex API behavior, pagination, autocomplete, and exports into clear state." },
          { label: "Validate", title: "Protect the product workflows", content: "Jest, Cypress, and Playwright coverage verified authenticated paths and reduced regressions." },
        ],
      },
      {
        type: "outcome",
        title: "Consistency became an engineering capability",
        content:
          "Reusable React components and shared patterns reduced one-off interface decisions while making complex search, export, and reporting workflows easier to understand and test.",
      },
    ],
  },
};
