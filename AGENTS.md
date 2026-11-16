# Agent Instructions

Before changing code in this repository, read and follow [`CODE_CONVENTIONS.md`](./CODE_CONVENTIONS.md).

Treat those conventions as the project-specific source of truth for architecture, styling, localization, data, assets, and validation. Re-read the relevant sections before making changes that cross those areas.

## Implementation Approach

- Prefer the simplest elegant implementation that fully solves the problem. This is a small portfolio site, so avoid indirection, abstractions, dependencies, and state that do not clearly reduce complexity.
- Keep code DRY and modular when a shared abstraction makes behavior easier to trace. Do not create abstractions merely to remove a few repeated lines.
- Keep user-facing copy in i18n resources. Components and static layout data should reference stable translation keys rather than embed display text.
- Reuse the existing shared typography system in [`src/styles/_type.scss`](./src/styles/_type.scss) and the shared style tokens and mixins in [`src/styles`](./src/styles). Do not introduce component-specific font sizes, transition durations, colors, spacing scales, or interaction treatments when an existing shared value applies.
- Before adding a new component, mixin, variable, or style file, check whether an existing common component or shared style can be extended cleanly. Consolidate redundant implementations when doing so makes the code simpler and more traceable.
