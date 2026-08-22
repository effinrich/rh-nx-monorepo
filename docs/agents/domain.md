# Domain Docs

How the engineering skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT-MAP.md`** at the repository root, if it exists. It points to the `CONTEXT.md` files for each relevant domain.
- **`docs/adr/`** for system-wide architectural decisions.
- Context-specific ADR directories referenced by `CONTEXT-MAP.md`, commonly beneath `apps/<context>/` or `libs/<context>/`.
- **`apps/company-api/doc/architecture/decisions/`** when working on the company API.

If any of these files do not exist, proceed silently. Do not flag their absence or suggest creating them upfront. The `domain-modeling` skill creates context documents and ADRs lazily when terms or decisions are resolved.

## File structure

This repository uses a multi-context layout:

```text
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                              # System-wide decisions
├── apps/
│   └── <context>/
│       ├── CONTEXT.md
│       └── docs/adr/                     # App-context decisions
└── libs/
    └── <context>/
        ├── CONTEXT.md
        └── docs/adr/                     # Library/domain decisions
```

Existing domain-specific conventions remain valid. In particular, company API decisions live under `apps/company-api/doc/architecture/decisions/`.

## Use the glossary's vocabulary

When output names a domain concept—in an issue title, refactor proposal, hypothesis, or test name—use the term defined in the relevant `CONTEXT.md`. Do not drift to synonyms the glossary explicitly avoids.

If a required concept is absent, reconsider whether the project already uses another term. If it represents a real gap, note it for the `domain-modeling` skill.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, surface the conflict explicitly rather than silently overriding it:

> Contradicts ADR-0007—but may be worth reopening because…
