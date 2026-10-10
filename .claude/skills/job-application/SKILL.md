---
name: job-application
description: Use when Ryan is applying for a job, tailoring his CV to a job description/advert, preparing a cover letter or supporting statement, or wants a job ad analysed against his experience. Triggers on a pasted JD, a LinkedIn/recruiter job URL, "apply for", "tailor my CV", "cover letter for this role".
---

# Job application

Scaffold a job application from Ryan's existing CV dataset, tailor a CV to
a specific job description, and produce internal working material (gaps,
term mappings, cover-letter outline, company research) to maximise the
chance of being shortlisted.

## THE SPINE CONSTRAINT — read first

**The only artefact that goes to an employer and that this skill produces
is the CV PDF, and it is assembled from VERBATIM `cv.yml` text only —
bullets selected and reordered, never rewritten, never generated.**

- Do NOT write cover-letter prose, supporting-statement prose, or any CV
  bullet text. You SELECT existing content and STRUCTURE scaffolding.
- The cover-letter "outline" is structure + which existing points to hit +
  hooks from the ad. It is NOT a drafted letter. Ryan writes the prose.
- Term mappings, gaps, matrices, research = internal working aids. Fine to
  author. They are never sent to an employer.
- If you catch yourself drafting a sentence Ryan would send out: STOP.
  That is his to write.

## Paths

- CV repo: `$HOME/src/spikeheap.github.io`
- CV dataset (source of truth): `src/_data/cv.yml` (read it every run)
- Typst template: `typst/cv.typ`, fonts `typst/fonts`
- Applications root: `$HOME/Documents/Employment/Job applications`

## Inputs

Company, role title, and the job description as a **URL or pasted text**.
Company/role research and the direct-application finder **run
automatically**.

## Workflow

1. **Gather + scaffold.** Determine company, role, date (today). Create
   `$HOME/Documents/Employment/Job applications/YYYY-MM-DD_Company_Role/`
   (slugify Company and Role with hyphens). Save the JD verbatim to
   `job-description.md` with the source URL at the top. If a URL was given,
   fetch it; if the fetch is blocked, ask Ryan to paste (he often has it).
   Copy the templates (below) into the folder, and create an **empty**
   `cover_letter.md` (fixed name — Ryan writes the prose; the empty stub
   just prevents naming drift across applications).

2. **Dispatch two subagents in parallel** (use the Agent tool, run
   concurrently):
   - **Research** (web): company + role background — what they do, recent
     news/context, funding/structure, mission, things for Ryan to consider,
     and interview probes / questions to ask. → `analysis.md` §8.
   - **Direct-application finder** (web): especially when the ad is via
     LinkedIn or a recruiter ("my client…"), try to identify the actual
     hiring organisation and a canonical application route OUTSIDE LinkedIn
     (the org's own careers page / ATS). Ryan prefers direct applications.
     Return: best-guess org + confidence + any direct URL, or an explicit
     "could not determine" with what was ruled out.

3. **Cross-application comparison.** Read sibling folders under the
   applications root (their `job-description.md`, `job.sel.yml`,
   `analysis.md`, `status.md`). Surface: reusable selections / cover angles
   from similar past roles; recurring JD themes; consistency/dedup flags
   (same experience described differently); a one-line status overview
   across all applications. → `analysis.md` §9.

4. **Build the CV selection.** Read `cv.yml`. Choose the base `view`
   (`tech_leadership` | `security_leadership` | `consultancy`) that best
   fits the ad. Pick the bullet indices that cover the JD's requirements
   (use the §3 matrix — aim to evidence every point you can). Write
   `job.sel.yml` (see schema below). The COMPLETE work history always
   renders: roles you don't feature appear header-only, so never leave a
   timeline gap. Use `title_override` only to match the ad's wording with a
   truthful title. Never put rewritten bullet text in the selection.

   **CTO-roles rule:** when the target role is a CTO (or CTO-equivalent —
   Head of Technology, etc.), feature EVERY one of Ryan's CTO-titled roles
   (currently `bookwhen`, `kudos`, `nmi_cto`) at least to summary level.
   Give each an `include` entry; if you don't need its achievements use an
   empty list `[]` (summary, no bullets). Bullets may be trimmed, but the
   summary must always appear — never reduce a CTO role to header-only on a
   CTO application.

5. **Render + page-fit check.** Run the render command (below); report the
   page count (`pdfinfo` / `mdls`). **Coverage beats the page target:** the
   goal is **≤ 3 pages**, but do NOT drop content to hit it. If the CV runs
   long, keep the coverage and instead add `TODO(3pp): …` comments in
   `job.sel.yml` against the lowest-value bullets that *could* be cut — note
   the JD point each covers and what is lost — then **defer the decision to
   Ryan**. Never silently trim.

6. **Compose analysis.** Fill `analysis.md` §§1–9 (see template). Update
   `status.md` (stage = drafting; logistics checklist; add the direct
   application route).

7. **Report to Ryan**, in this order: red flags first, direct-application
   route, gaps, then suggested next actions. Point to the rendered CV.

## `job.sel.yml` schema

```yaml
view: tech_leadership            # base view: statement / skills / titles / tagline
order: [bookwhen, gds, moj]      # role ids (from cv.yml), in render order
include:
  bookwhen: [0, 1, 2]            # bullet indices into that role's bullets list, in order
  gds: [2]
  nmi_cto: []                    # empty list = summary only, no bullets (e.g. CTO-roles rule)
# Roles absent from `include` render header-only (title · company · dates).
# show_keywords: false           # optional: drop the keywords footer
# optional, ONLY with Ryan's own true text:
# title_override: { bookwhen: "Interim Chief Technology Officer" }
# statement_override: |
#   ...verbatim text Ryan wrote...
```

Roles by stable `id`, bullets by index. No bullet text is copied here →
zero drift. Regenerated per job, so index fragility is a non-issue.

## Render command

The selection lives outside the repo, so root at `$HOME` and pass a
root-relative sel path:

```bash
SEL="/Documents/Employment/Job applications/<folder>/job.sel.yml"  # root-relative (no $HOME)
typst compile \
  --root "$HOME" \
  --font-path "$HOME/src/spikeheap.github.io/typst/fonts" \
  "$HOME/src/spikeheap.github.io/typst/cv.typ" \
  "$HOME/Documents/Employment/Job applications/<folder>/cv.pdf" \
  --input "sel=$SEL"
```

The `garamond` font warning is harmless. Default (audience-filtered) mode
still works when `--input sel=` is omitted — do not change that path.

## Retrofit to cv.yml (optional, on request only)

After an application is finalised, Ryan may have written genuinely new true
content (a new bullet for an uncovered requirement, an added metric, an
ATS-aligned rewording, a new skills keyword). When he asks to retrofit:

- Land ONLY content Ryan wrote/approved — never generated prose, never the
  per-job selection/ordering (that is job-specific).
- **Propose a diff, apply on confirmation.** Draft the exact `cv.yml`
  edits (correct `audiences` tags, source order, British English, `TODO:`
  markers where unconfirmed), show them, and apply only after Ryan
  confirms.

## Templates

Copy these into the new application folder at scaffold time:
- `templates/status.md` → `status.md`
- `templates/analysis.md` → `analysis.md`

Also create an empty `cover_letter.md` (no template — Ryan writes it; the
cover-letter *outline* lives in `analysis.md` §7).

## Red flags — STOP

- About to write a cover-letter sentence / CV bullet → that's Ryan's. Stop.
- Putting rewritten bullet text into `job.sel.yml` → use indices only.
- Editing `cv.yml` to tailor for one job → use the selection file instead.
- Omitting a role and leaving a gap in the work-history timeline → every
  role renders at least header-only; only `omit` deliberately, and say so.
- Dropping content to hit the page target (≤ 3pp) → coverage wins; flag
  trim candidates as `TODO(3pp):` and let Ryan decide.
- Reducing a CTO role to header-only on a CTO application → CTO roles keep
  their summary (use `include: []` for summary-only).
