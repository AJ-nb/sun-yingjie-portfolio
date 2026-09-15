# XHS Operations OS V2 — Roadmap

**Roadmap rule:** phases are sequential quality gates, not calendar promises. Do not advance because a UI looks complete; advance when the phase exit criteria pass.

## P0 — Foundation and repository governance

### Deliverables

- repository scaffold;
- root `AGENTS.md` installed;
- all V2 normative docs committed;
- pnpm workspace;
- Next.js TypeScript app shell;
- lint/typecheck/test/build commands;
- CI workflow;
- Supabase local/dev setup;
- migration framework;
- environment-variable validation;
- basic auth shell;
- security baseline;
- Skill lock/governance file.

### Exit criteria

- fresh clone can install and build;
- CI runs typecheck/lint/unit/build;
- protected secrets are not required for pure unit tests;
- local Supabase migrations apply cleanly;
- first RLS policy test runs;
- Codex can explain architecture after reading repo docs.

## P1 — Product Brain

### Deliverables

- workspaces/brand versions;
- suppliers;
- products/product versions;
- truth classes and truth snapshots;
- product status taxonomy;
- asset originals/provenance;
- product CRUD UX;
- sample/verification UX;
- product-truth Skill;
- product ingest Skill;
- supplier audit baseline.

### Core E2E

```text
Create product
→ link supplier
→ mark product status
→ upload real images
→ add verified material fact
→ add unknown dimension
→ add forbidden originality claim
→ create immutable truth snapshot
```

### Exit criteria

- no AI generation required to use Product Brain;
- RLS passes for all P1 tables;
- original assets remain immutable;
- a truth snapshot reconstructs product facts exactly.

## P2 — Content Creation Engine

### Deliverables

- content briefs;
- audience/content-pillar selection;
- topic candidates;
- angle candidates;
- title lab;
- copy generation;
- independent quality ranker;
- structured output validation;
- AI run provenance;
- initial repository fallback prompts;
- OpenAI server-side integration.

### Core E2E

```text
Product truth snapshot
→ content brief
→ topic candidates
→ selected angle
→ title candidates
→ copy candidates
→ quality ranking
→ REVIEW_REQUIRED
```

### Exit criteria

- every machine-consumed AI result passes schema validation;
- no missing product fact is invented in gold eval cases;
- candidate and judge are independent steps;
- AI run metadata is stored.

## P3 — Truth, Compliance and Eval Gates

### Deliverables

- fact checker;
- platform rule/version registry;
- current Xiaohongshu rule evidence loader/admin UX;
- compliance reports/findings;
- risk rewriter;
- Promptfoo baseline;
- gold eval datasets;
- blocking gate integration;
- rule snapshot hashing.

### Core E2E

```text
Generated copy
→ truth check
→ compliance check
→ blocked or reviewable
→ targeted rewrite
→ re-check
→ human review candidate
```

### Exit criteria

- hard-gate gold dataset passes 100%;
- blocked content cannot transition to `READY`;
- findings show exact rule version/evidence;
- benign test cases are tracked for false positives.

## P4 — Image Studio and Product Consistency

### Deliverables

- visual-brief schema/UI;
- image prompt composer;
- image generation/editing job abstraction;
- source-asset selection;
- product-consistency review;
- visual-quality review;
- image provenance UI;
- image eval fixtures.

### Core E2E

```text
Real reference asset
→ visual brief
→ image job
→ generated asset
→ consistency review
→ compliance/quality review
→ human approval
```

### Exit criteria

- generated asset never replaces original;
- all derivatives preserve provenance;
- critical geometry mismatch blocks approval;
- asset review status is visible to operator.

## P5 — Operations: Approval, Package, Calendar

### Deliverables

- human approval request/event;
- READY state transition;
- publishing package;
- ManualPublisher;
- copy/download/export controls;
- calendar;
- manual published-post record.

### Core E2E

Run the complete V2 acceptance path from Product to a manual publish package.

### Exit criteria

- only approved content/assets enter package;
- package is immutable/checksummed;
- no automatic Xiaohongshu account write is required;
- published record references its exact package.

## P6 — Metrics and Learning

### Deliverables

- post metric snapshots;
- derived metric definitions;
- postmortem workflow;
- product/content dashboards;
- PostHog instrumentation for application workflow;
- observed-vs-hypothesis separation.

### Exit criteria

- metrics preserve denominators/source timestamps;
- analytics can trace performance to product/content/prompt versions;
- postmortem does not present causal claims without evidence;
- application funnel instrumentation is usable.

## P7 — PromptOps and Production Evals

### Deliverables

- Langfuse integration;
- prompt migration to registry;
- fallback prompt contract;
- prompt labels/version UI metadata;
- trace linkage;
- dataset/experiment workflow;
- CI candidate-vs-production comparison;
- Promptfoo red-team suite expansion.

### Exit criteria

- production prompt change can be reconstructed;
- candidate cannot promote with hard-gate regression;
- production failure can be sanitized into an eval case;
- PromptOps outage uses validated fallback or fails closed.

## P8 — Market Intelligence

### Deliverables

- research workspace;
- source/evidence records;
- audience/competitor observations;
- topic pattern extraction;
- freshness labels;
- no-fabricated-trend enforcement.

### Exit criteria

- research insight cites source/date;
- unverified popularity is never promoted to fact;
- Research remains optional to core content generation.

## P9 — Optional Publisher/Connector Experiments

This phase is not required for V2 success.

Possible work only after current official capabilities and platform rules are verified:

- official publishing adapter if a suitable official API exists;
- isolated browser-assist experiment;
- connector-based data import.

### Hard constraints

- no stealth/anti-detection requirement;
- no engagement farming;
- no account warming;
- no cookie/session storage in primary DB;
- explicit human approval for every consequential account write;
- core workflow continues to function with `ManualPublisher` alone.

## 1. Immediate implementation sequence after these specs

### Epic 1 — Repository bootstrap

1. initialize pnpm workspace;
2. create `apps/web`;
3. create package boundaries;
4. add TypeScript/lint/test configuration;
5. add CI;
6. add environment schema;
7. add base error/result types;
8. add initial route shell.

### Epic 2 — Supabase foundation

1. local Supabase configuration;
2. identity/workspace migrations;
3. workspace membership RLS;
4. products/suppliers migrations;
5. generated database types;
6. repository abstraction;
7. RLS integration tests.

### Epic 3 — Product Brain vertical slice

1. Product List;
2. New Product;
3. Product Version;
4. Truth Items;
5. source assets;
6. Truth Snapshot;
7. product-detail E2E test.

Do not begin content AI features until Epic 3 is stable.

## 2. Quality gate by change type

| Change | Mandatory verification |
|---|---|
| UI | typecheck + unit + Playwright relevant flow |
| Database | migration + generated types + RLS tests |
| AI prompt/model | offline eval + hard gates + provenance |
| Platform rule | source verification + version record + compliance regression |
| Skill | source/review + Skill eval + permission review |
| External integration | failure-mode test + least-privilege review |
| Security-sensitive | security review + regression test |

## 3. Backlog principles

A backlog item is accepted when it improves at least one of:

- truth reliability;
- content production efficiency;
- content/visual quality;
- platform compliance confidence;
- operator review speed;
- measurement quality;
- learning speed;
- system security/reliability.

Features whose primary value is “more automation” without a measurable improvement in these dimensions are lower priority.

## 4. Defer until evidence exists

Do not pre-build:

- multi-region infrastructure;
- microservices;
- complex queue clusters;
- public billing/tenant plans;
- fully automated publisher;
- broad social crawling platform;
- advanced CRM;
- full 1688 order automation;
- complex role administration UI.

## 5. Architecture checkpoint criteria

Revisit the V2 architecture only when one of the following is observed:

- modular monolith creates a demonstrated scaling/deployment bottleneck;
- official Xiaohongshu APIs materially change publishing/data access options;
- product scope expands beyond a single operator/team workflow;
- eval/prompt workload requires a dedicated runtime boundary;
- regulatory/platform requirements require new data isolation.

Until then, prefer improving the existing modular boundaries over introducing infrastructure complexity.
