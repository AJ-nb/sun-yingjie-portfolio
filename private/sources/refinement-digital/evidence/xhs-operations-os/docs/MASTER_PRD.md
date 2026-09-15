# XHS Operations OS V2 — Master Product Requirements Document

**Document type:** normative PRD  
**Version:** 2.0 architecture baseline  
**Primary user:** owner-operator / designer running a Xiaohongshu-oriented product business  
**Product mode:** internal operations workstation, desktop-first

## 1. Product statement

XHS Operations OS is an AI-native operations system that converts verified product information into reviewable Xiaohongshu content packages while preserving product truth, visual provenance, platform-rule awareness, and measurable learning.

It is not an auto-posting bot, an engagement-farming tool, a fake-persona generator, or a generic AI chat wrapper.

## 2. Problem definition

A small design-led commerce operation has four recurring failure modes:

1. **product truth drift** — supplier copy, AI copy, images, and actual goods diverge;
2. **content inconsistency** — each post is generated with a different tone, claim standard, visual language, or prompt;
3. **platform risk** — rules change, sensitive categories have narrower commercial options, and a strong creative asset may still be unusable;
4. **no learning loop** — likes, saves, clicks, orders, prompt versions, and product versions are not connected, so repeated content production does not improve systematically.

V2 solves these through structured data, deterministic workflows, specialized Skills, versioned prompts, compliance gates, human approval, and post-publication feedback.

## 3. Product principles

### 3.1 Truth before persuasion

No content-quality score can override a product-fact contradiction.

### 3.2 Workflow before agent autonomy

The application orchestrates explicit steps. AI is invoked inside those steps; it does not own workflow state.

### 3.3 Human approval before external publication

V2 prepares a publish package. Production publishing remains manual by default.

### 3.4 Version everything that changes behavior

Products, facts, rules, prompts, Skills, model configs, generated assets, and evaluations need reconstructable history.

### 3.5 Sensitive-category content requires enhanced review

A product/category risk profile can increase required checks and prevent content from reaching `READY`.

### 3.6 Data should make the next decision better

Analytics exists to influence content strategy, product selection, prompts, and experiments—not to decorate a dashboard.

## 4. Users and jobs-to-be-done

### Primary user: owner-operator / product designer

Needs to:

- ingest supplier products and physical-sample facts;
- separate facts from inferences and marketing claims;
- decide which content angle is worth producing;
- generate text and visual concepts quickly;
- preserve exact product structure in generated visuals;
- detect false or risky claims before publication;
- package an approved note for manual publishing;
- record real post performance;
- understand why a post worked or failed;
- improve future prompts/strategies based on evidence.

### Secondary future user: reviewer/editor

Needs to compare source facts, generated copy, visual assets, compliance findings, and changes without editing the underlying product truth accidentally.

Multi-role permission UX is not required before the core single-operator workflow is stable.

## 5. Current platform constraint baseline

At this architecture baseline, official Xiaohongshu materials show that 聚光's prohibited-promotion directory includes intimate products such as SM tools and that 蒲公英 content rules treat sex-related/intimate-product topics as high-risk private/low俗 content. The official rules also target misleading personas, low-value bulk AI content, unsupported promotional statements, sexualized content, and off-platform diversion.

Product requirement:

- store the applicable rule as versioned `platform_rules` evidence;
- never assume a rule remains unchanged;
- distinguish `organic-content review` from `paid-ad eligibility`;
- block any workflow that depends on policy circumvention.

## 6. Scope

### V2 core scope

- workspace and brand configuration;
- supplier and product library;
- product truth / claim system;
- product and generated asset library;
- content brief builder;
- topic, angle, title, body, CTA and visual-brief generation;
- structured AI output and provenance;
- product-truth verification;
- versioned Xiaohongshu compliance rules and findings;
- image generation/editing request orchestration;
- product-consistency review;
- human approval;
- publish-package export;
- content calendar;
- manual performance entry/import;
- analytics and postmortems;
- prompt/Skill version visibility;
- offline evaluation and production trace hooks.

### Explicit non-goals for V2

- automated Xiaohongshu login/session farming;
- covert or anti-detection browser automation;
- automated likes/comments/follows;
- fake engagement or account warming;
- automatic off-platform lead diversion;
- automatic social-platform publishing as a production dependency;
- full ERP, accounting, warehouse or order-management replacement;
- broad web scraping as a prerequisite for the core workflow;
- multi-tenant public SaaS billing.

## 7. Primary end-to-end workflow

```text
Create/Select Product
→ Verify Product Facts
→ Select Audience / Content Goal
→ Generate Topic Candidates
→ Rank Topic
→ Generate Content Angles
→ Generate Titles / Body / CTA
→ Fact Check
→ Compliance Check
→ Create Visual Brief
→ Generate/Edit Assets
→ Product-Consistency Review
→ Human Review
→ Approve
→ Build Publish Package
→ Manual Publish
→ Record Metrics
→ Postmortem
→ Feed Failures/Winners into Evals and Strategy
```

## 8. Functional requirements

### FR-01 Workspace and Brand Brain

The user can maintain:

- brand positioning;
- target audience descriptors;
- tone and preferred vocabulary;
- forbidden vocabulary and brand claims;
- design/CMF language;
- visual direction;
- content pillars;
- CTA style;
- current business constraints.

Brand configuration is versioned so an older generated post can be reconstructed against the brand rules that produced it.

### FR-02 Supplier Library

The system can record:

- supplier identity and source;
- product source URL/reference;
- sample status;
- unit cost and shipping cost in minor currency units;
- MOQ;
- lead time notes;
- fulfillment/packaging observations;
- customization/ODM capability;
- licensing/asset-use notes;
- supplier quality score and evidence.

### FR-03 Product Library

Each product has:

- canonical SKU/name;
- product status taxonomy;
- category and platform-risk profile;
- current product version;
- verified facts;
- claim controls;
- source assets;
- physical-sample observations;
- pricing hypothesis;
- supplier relationship;
- active/inactive lifecycle state.

### FR-04 Product Truth Layer

The system must:

- distinguish `FACT`, `UNKNOWN`, `INFERENCE`, `ALLOWED_CLAIM`, `FORBIDDEN_CLAIM`;
- attach evidence source and verifier to facts/claims;
- create a point-in-time `truth_snapshot` for every generation run;
- hard-fail output containing contradictions or forbidden claims;
- prevent originality claims inconsistent with product status.

### FR-05 Asset Library and Provenance

The system stores originals separately from derivatives and records one source type per asset:

- `REAL_PHOTO`
- `SUPPLIER_IMAGE`
- `AI_GENERATED`
- `AI_EDITED`
- `CG_RENDER`

Generated/edited assets preserve source asset IDs, model, prompt version, product version, and approval status.

### FR-06 Content Brief

The user selects or enters:

- product;
- content goal;
- target audience;
- content pillar;
- desired angle constraints;
- platform surface;
- organic vs paid-use intention;
- desired asset ratio/format;
- optional reference material.

The brief must display which inputs are facts versus creative constraints.

### FR-07 Strategy Generation

The strategy workflow produces structured topic candidates with:

- topic;
- target reader;
- problem/tension;
- content angle;
- rationale summary;
- freshness dependency;
- evidence dependency;
- platform-risk flags;
- estimated brand fit;
- estimated product relevance.

No fabricated trend is allowed. If a trend cannot be verified, mark the strategy `evergreen` or `unverified` rather than inventing popularity.

### FR-08 Copy Generation

The system generates candidate sets rather than a single opaque answer.

Minimum outputs:

- title candidates;
- hook/lead;
- body;
- CTA;
- keyword set;
- hashtag suggestions;
- cover-text suggestion;
- factual claim references;
- risk annotations.

Copy consumed by the UI uses validated structured output.

### FR-09 Fact Checker

Before quality ranking, generated copy is compared against the truth snapshot.

Outcomes:

- `PASS`
- `FAIL_CONTRADICTION`
- `FAIL_FORBIDDEN_CLAIM`
- `REVIEW_UNKNOWN`

A contradiction or forbidden claim blocks `READY`.

### FR-10 Platform Compliance

The rule engine evaluates:

- product-category eligibility/risk;
- organic-content restrictions;
- paid-promotion eligibility;
- sexualized/low俗/private-content risk;
- false persona/deceptive positioning;
- unsupported absolute/promotional claims;
- off-platform diversion patterns;
- intellectual-property/authorization concerns;
- platform-evasion patterns.

Findings reference `rule_version_id` and preserve the exact evidence version used.

### FR-11 Risk Rewriter

The system can rewrite only the flagged segment while preserving the rest of approved copy. It must never rewrite around a prohibition in a way intended to evade detection.

### FR-12 Visual Brief

The visual workflow produces structured fields:

- product identity and consistency constraints;
- view/camera;
- composition;
- lighting;
- environment;
- model/person presence if allowed;
- wearing logic;
- material/CMF facts;
- allowed creative changes;
- forbidden geometry/part changes;
- platform-risk notes;
- output ratio/use case.

### FR-13 Image Generation / Editing

The system can submit approved source assets plus the visual brief to the configured image provider. The user must be able to see which source images were used.

### FR-14 Product-Consistency Review

Review dimensions:

- silhouette;
- part count;
- hardware count;
- hardware location;
- closure/connection structure;
- material representation;
- color/finish;
- wearing logic;
- key proportions.

A failed structural check prevents an asset from becoming `APPROVED_FOR_PUBLISHING`.

### FR-15 Human Review

A reviewer sees:

- product truth snapshot;
- generated copy;
- fact-check result;
- compliance result;
- source and generated assets;
- asset provenance;
- quality scores;
- generation versions.

Approval records actor, timestamp, selected content version, selected assets, and rule snapshot.

### FR-16 Publish Package

A publish package contains:

- final title;
- final body;
- hashtags/keywords;
- final ordered assets;
- cover text;
- platform-use classification;
- approval evidence;
- export/copy controls.

The package is designed for manual publishing. A future publisher adapter cannot bypass existing approval state.

### FR-17 Calendar

Calendar entries display:

- planned date/time;
- product;
- content goal;
- current status;
- required review flags;
- final publish package;
- actual published URL/identifier once recorded.

### FR-18 Metrics

V2 supports manual entry/import of:

- impressions/views;
- likes;
- comments;
- saves/favorites;
- shares;
- profile visits when available;
- product clicks when available;
- orders/revenue when attributable;
- refunds when attributable.

Derived metrics must retain denominator definitions.

### FR-19 Analytics and Postmortem

The system should answer:

- which content pillars produce high saves;
- which titles are repeatedly regenerated/rejected;
- which products generate high click but low conversion;
- which visual patterns correlate with better downstream metrics;
- which compliance rules cause the most failures;
- which prompt/Skill versions perform better on comparable evals.

AI-generated postmortems must distinguish observed metrics from hypotheses.

### FR-20 Prompt / Skill / Eval visibility

The operator can identify which prompt and Skill versions created an output. Prompt editing UI may arrive after the core content workflow, but provenance must exist from the first AI-enabled release.

## 9. Quality attributes

### Reliability

- deterministic workflow state;
- idempotent generation job submission where feasible;
- resumable review state;
- no silent downgrade from schema-validated to free-form output.

### Security

- RLS on all exposed Supabase tables;
- least privilege;
- no production secrets in client code;
- untrusted input separation;
- explicit approval for external writes.

### Auditability

Given a published package, the system must reconstruct:

- product version;
- truth snapshot;
- brand version;
- rule version;
- prompt and Skill versions;
- selected model;
- generated content version;
- approved asset versions;
- human approval.

### Usability

The core Product → Content → Review → Publish Package path should require no hidden terminal operations for the operator.

## 10. Success metrics

The project will track its own operating impact rather than using arbitrary vanity targets.

Primary internal metrics:

- median number of regeneration actions per approved content package;
- percentage of generated outputs passing fact/compliance gates on first attempt;
- percentage of generated assets accepted without structural correction;
- operator time spent per publish package, measured after instrumentation exists;
- ratio of approved to rejected AI candidates;
- number of production regressions caught by evals before release;
- percentage of published posts with complete provenance and metrics.

Commercial metrics are tracked separately and never substituted for AI-quality metrics.

## 11. Release acceptance for V2 core workflow

V2 core is considered operational only when one product can complete this exact path:

```text
Create Product
→ add verified facts and forbidden claims
→ upload real reference images
→ create Content Brief
→ generate topic candidates
→ select angle
→ generate copy candidates
→ pass truth check
→ pass compliance review
→ generate visual brief
→ generate or attach final assets
→ pass product-consistency review
→ human approve
→ create publish package
→ place on calendar
→ export/copy package for manual publication
→ record published metrics
→ generate evidence-grounded postmortem
```

All steps must preserve traceability.

## 12. Authoritative references

- Xiaohongshu 聚光 — current content review / prohibited promotion directory
- Xiaohongshu 蒲公英 — current content cooperation review rules
- OpenAI — current Codex, Skills/Plugins, Responses API documentation
- Supabase — current RLS and AI/MCP documentation
- Langfuse — current Prompt Management and Evaluation documentation
- Promptfoo — current Evaluation / CI / Red Team documentation
