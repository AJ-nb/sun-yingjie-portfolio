# XHS Operations OS V2

Internal, desktop-first operations software for turning verified product information into reviewable Xiaohongshu content packages. The normative product and architecture requirements are listed in `SPEC_MANIFEST.json`.

## Requirements

- Node.js `>=22.22.0`
- Corepack-enabled pnpm `11.25.0`

## Current commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm check:boundaries
pnpm typecheck
pnpm lint
pnpm test
```

Only commands backed by implemented capabilities are exposed. Integration, end-to-end, and AI evaluation commands are introduced by their owning P0/P1+ tasks.

## Internal packages

Internal packages use the `@xhs/*` namespace and `workspace:*` dependencies. Consumers import only package exports, such as `@xhs/ui/components/button`; imports from another package's `src` or `internal` tree are prohibited. Run `pnpm check:boundaries` to validate dependency direction, workspace protocol usage, unknown packages, and cycles.
