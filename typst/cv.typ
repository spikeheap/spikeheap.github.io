// Ryan Brooks — CV (PDF via Typst)
//
// Reads the same dataset as the web CV at src/_data/cv.yml so the two
// surfaces stay in lockstep. Filters experience bullets by audience tag the
// same way the ERB layout does.
//
// Compile:
//   typst compile typst/cv.typ typst/output/cv.pdf
//   typst compile typst/cv.typ typst/output/cv-security.pdf \
//       --input view=security_leadership
//
// View options: tech_leadership (default) | security_leadership | consultancy

#let cv = yaml("../src/_data/cv.yml")

// Per-job tailoring. When `--input sel=<path>` is supplied, the CV renders an
// explicit per-job selection (chosen roles + bullet indices, in order) instead
// of the audience-filtered default. The path is resolved by Typst against the
// project root, so callers compile with `--root $HOME` and a root-relative path
// (e.g. sel=/Documents/.../job.sel.yml). See the job-application skill.
#let sel-path = sys.inputs.at("sel", default: "")
#let sel = if sel-path != "" { yaml(sel-path) } else { none }
#let view = if sel != none { sel.view } else { sys.inputs.at("view", default: "tech_leadership") }

// Resolve a role by its stable `id`; used by selection-driven rendering.
#let find-role(id) = cv.experience.find(r => r.id == id)

// Selection mode renders the COMPLETE experience history in canonical (CV)
// order, so the timeline never has unexplained gaps. `include` decides which
// roles are *featured* (summary + chosen bullets); every other role still
// renders as a compact header-only entry (title · company · dates). `omit`
// drops a role deliberately — note any omission in the application analysis.
#let sel-omit = if sel != none { sel.at("omit", default: ()) } else { () }
#let roles-to-render = if sel != none {
  cv.experience.filter(r => r.id not in sel-omit)
} else { cv.experience }

// ----------------------------------------------------------------------------
// helpers
// ----------------------------------------------------------------------------

#let MONTHS = ("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

// "2026-03" → "Mar 2026"; "2012-12-16" → "Dec 2012"; "2005" → "2005";
// "present" / "" / none → "present".
#let month-year(value) = {
  let s = str(value)
  if s == "present" or s == "" or s == "none" {
    "present"
  } else {
    let parts = s.split("-")
    if parts.len() < 2 {
      s
    } else {
      let idx = int(parts.at(1)) - 1
      if idx < 0 or idx > 11 { s } else { MONTHS.at(idx) + " " + parts.at(0) }
    }
  }
}

// Collapse whitespace runs (including the newlines that YAML literal blocks
// emit) into single spaces. Without this, Typst renders YAML soft-wrapped
// strings as hard line breaks at every source-line boundary.
#let collapse-ws(s) = str(s).split(regex("\s+")).filter(p => p != "").join(" ")

// Render a YAML literal-block string as one or more paragraphs, preserving
// blank-line boundaries as paragraph breaks.
#let paragraphs(value) = {
  let blocks = str(value).split(regex("\n[ \t]*\n"))
  for (i, p) in blocks.enumerate() {
    if i > 0 { parbreak() }
    collapse-ws(p)
  }
}

#let role-title(role) = {
  let ov = if sel != none { sel.at("title_override", default: (:)) } else { (:) }
  if role.id in ov {
    ov.at(role.id)
  } else {
    let titles = role.at("titles", default: (:))
    titles.at(view, default: titles.at("default", default: ""))
  }
}

// Selection mode: render exactly the listed bullet indices, in order.
// Default mode: audience-filter the role's bullets.
#let bullets-for(role) = {
  if sel != none {
    sel.at("include", default: (:)).at(role.id, default: ()).map(i => role.bullets.at(i))
  } else {
    role.at("bullets", default: ()).filter(b => view in b.at("audiences", default: ()))
  }
}

#let capitalize(s) = upper(s.at(0)) + s.slice(1)

// ----------------------------------------------------------------------------
// theme
// ----------------------------------------------------------------------------

#let INK         = rgb("#1d1d1f")
#let MUTED       = rgb("#5a5a5a")
#let FAINT       = rgb("#8a8a8a")
#let RULE        = rgb("#cfcfcf")
#let ACCENT      = rgb("#1f3a5f") // dark navy — dates, links, section labels
#let ACCENT_SOFT = rgb("#c3ccd8") // light slate for section rules

#let SERIF = ("EB Garamond", "Iowan Old Style", "Garamond")
#let SANS  = ("IBM Plex Sans", "Helvetica Neue", "Helvetica", "Arial")

// ----------------------------------------------------------------------------
// document
// ----------------------------------------------------------------------------

#let view-label = if view == "security_leadership" {
  "Security leadership CV"
} else if view == "consultancy" {
  "Consultancy"
} else {
  "CV"
}

#set document(
  title: "Ryan Brooks — " + view-label,
  author: cv.profile.name,
)

#set page(
  paper: "a4",
  margin: (top: 16mm, bottom: 14.4mm, x: 17.6mm),
)

#set text(font: SERIF, size: 11.5pt, fill: INK)
#set par(justify: false, leading: 0.62em, spacing: 0.72em)

// Helpers for inline typographic flourishes -----------------------------------

#let sans(body, ..args) = text(font: SANS, ..args, body)
#let sc-label(body, fill: ACCENT, size: 10pt) = text(
  font: SANS,
  size: size,
  weight: "semibold",
  tracking: 0.18em,
  fill: fill,
  upper(body),
)
#let date-tag(body) = sans(text(size: 9.75pt, weight: "regular", tracking: 0.08em, fill: ACCENT, upper(body)))

// Headings -------------------------------------------------------------------

#show heading.where(level: 1): it => block(below: 0em)[
  #text(font: SERIF, size: 28pt, weight: "regular", tracking: -0.01em)[#it.body]
]

// Section heading: small-caps sans label, then a hairline rule in a lightened
// accent. Ties section breaks into the accent palette.
#show heading.where(level: 2): it => block(above: 1.5em, below: 0.6em)[
  #grid(
    columns: (auto, 1fr),
    column-gutter: 0.6em,
    align: (left + horizon, left + horizon),
    sc-label(it.body),
    line(length: 100%, stroke: 0.5pt + ACCENT_SOFT),
  )
]

// Lists ----------------------------------------------------------------------
#set list(indent: 0.6em, body-indent: 0.5em, spacing: 0.4em, marker: ([•], [◦]))

// Links: accent colour, subtle underline.
#show link: it => text(fill: ACCENT, underline(offset: 1.5pt, stroke: 0.4pt, it))

// ----------------------------------------------------------------------------
// header band
// ----------------------------------------------------------------------------

#let dot-sep = sans(text(fill: FAINT)[ #h(0.3em) · #h(0.3em) ])

#let contact-links = (
  link(cv.profile.links.website)[ryanbrooks.co.uk],
  link(cv.profile.links.github)[github.com/spikeheap],
  link(cv.profile.links.linkedin)[linkedin.com/in/ryanpbrooks],
  link(cv.profile.links.mastodon)[\@spikeheap\@ruby.social],
).join(dot-sep)

// Header: single left-aligned column. Avoids the previous two-column layout
// where a tall right block (phone + email stacked) caused the left side to
// wrap awkwardly around it.

// Block with explicit below-spacing (not weak) so the name's descenders
// reliably clear the tagline that follows.
#block(below: 14pt)[
  #text(font: SERIF, size: 28pt, weight: "regular", tracking: -0.01em)[#cv.profile.name]
]

// Tagline: top three skill keywords for this view, served as a quiet muted
// strapline that tells the reader at a glance which role this CV is targeting.
#let tagline = cv.skills.at(view).slice(0, 3).join("  ·  ")

#text(font: SERIF, size: 12.5pt, fill: MUTED)[#tagline]

#v(0.55em)

// Location + phone + email on one line; online links on the next. Both
// rendered as plain inline runs, no grid — the right-aligned block was
// breaking the flow of the left content.
#sans(text(size: 10.75pt, fill: MUTED)[
  #cv.profile.location#if cv.profile.at("print_only", default: none) != none [
    #dot-sep #text(fill: INK)[#cv.profile.print_only.phone] #dot-sep #link("mailto:" + cv.profile.print_only.email)[#cv.profile.print_only.email]
  ]
])

#v(0.15em)
#sans(text(size: 9.75pt, fill: MUTED)[#contact-links])

#v(0.7em)
#line(length: 100%, stroke: 0.7pt + ACCENT)
#v(0.8em)

// ----------------------------------------------------------------------------
// statement — sits right under the header band, no section label needed
// ----------------------------------------------------------------------------

// Wider paragraph spacing than the body default, which is only fractionally
// larger than the line leading and made the paragraphs read as one block.
#block[
  #set par(spacing: 1.1em)
  #paragraphs(if sel != none and "statement_override" in sel { sel.statement_override } else { cv.statements.at(view) })
]

// ----------------------------------------------------------------------------
// experience
// ----------------------------------------------------------------------------

== Experience

#for role in roles-to-render [
  // Keep the role header (title + company + dates) together so a role never
  // splits with just a title at the bottom of a page.
  #block(breakable: false, above: 1.25em, below: 0.75em)[
    #grid(
      columns: (1fr, auto),
      align: (left + horizon, right + horizon),
      column-gutter: 1em,
      // Role title in sans semibold for a clear editorial contrast against
      // the serif body — without leaning into a heavier bold that would
      // shout. The company line below stays in sans at smaller size.
      sans(text(size: 12.5pt, weight: "semibold")[#role-title(role)]),
      date-tag(month-year(role.start) + " – " + month-year(role.at("end", default: "present"))),
    )
    #v(-0.05em)
    #text(font: SERIF, size: 11.25pt)[
      #text(fill: INK, weight: "semibold")[#role.company]#text(fill: MUTED)[#if role.at("type", default: none) != none [ · #role.type]#if role.at("location", default: none) != none [ · #role.location]]
    ]
  ]

  #let bs = bullets-for(role)
  // A role is "featured" if it appears as a key in `include` (even with an
  // empty bullet list → summary only); featured roles carry their summary,
  // header-only roles stay to a single compact line. This lets a policy
  // require a role's summary while trimming its bullets to none.
  #let featured = sel == none or (role.id in sel.at("include", default: (:)))
  #if role.at("summary", default: none) != none and featured [
    #collapse-ws(role.summary)
  ]

  #if bs.len() > 0 [
    #list(..bs.map(b => collapse-ws(b.text)))
  ]
]

// ----------------------------------------------------------------------------
// earlier career — collapsed to a single dense paragraph
// ----------------------------------------------------------------------------

#if cv.at("career_history", default: ()).len() > 0 [
  == Earlier career

  #let parts = cv.career_history.map(r => {
    let dates = month-year(r.start) + "–" + month-year(r.end)
    let loc = if r.at("location", default: none) != none { ", " + r.location } else { "" }
    r.role + ", " + r.company + loc + " (" + dates + ")"
  })
  #text(fill: MUTED, size: 10.75pt)[#parts.join("  ·  ")]
]

// ----------------------------------------------------------------------------
// certifications
// ----------------------------------------------------------------------------

#if cv.at("certifications", default: ()).len() > 0 [
  == Certifications

  #for c in cv.certifications [
    - #text(weight: "semibold")[#c.title]#if c.at("issuer", default: none) != none [, #c.issuer]#if c.at("status", default: none) != none [ — #emph[#c.status#if c.at("year", default: none) != none [ (#c.year)]]] else if c.at("date", default: none) != none [ — #month-year(c.date)] else if c.at("year", default: none) != none [ — #c.year]#if c.at("note", default: none) != none [ #text(fill: MUTED)[(#c.note)]]
  ]
]

// ----------------------------------------------------------------------------
// community & coaching
// ----------------------------------------------------------------------------

#let community-item(c) = {
  let name = if c.at("url", default: none) != none { link(c.url)[#c.name] } else { c.name }
  let end-label = if c.at("end", default: none) != none {
    " – " + (if str(c.end) == "present" { "present" } else { str(c.end) })
  } else { "" }
  let dates = "(" + str(c.start) + end-label + ")"
  let note = c.at("note", default: none)
  [#text(weight: "semibold")[#capitalize(c.kind)]: #name #text(fill: MUTED)[#dates]#if note != none [#linebreak()#text(size: 9.75pt, fill: MUTED)[#note]]]
}

#if cv.at("community", default: ()).len() > 0 [
  == Community & coaching

  #list(..cv.community.map(community-item))
]

// ----------------------------------------------------------------------------
// education
// ----------------------------------------------------------------------------

#if cv.at("education", default: ()).len() > 0 [
  == Education

  #for e in cv.education [
    - #text(weight: "semibold")[#e.institution] — #e.qualification #text(fill: MUTED)[(#e.start#if e.at("end", default: none) != none [ – #e.end])]
  ]
]

// ----------------------------------------------------------------------------
// keywords footer
// ----------------------------------------------------------------------------

// Selections can drop the keywords block with `show_keywords: false`.
#if sel == none or sel.at("show_keywords", default: true) [
  #v(1.3em)
  #align(center)[#sc-label("Keywords", fill: FAINT, size: 9.5pt)]
  #v(0.3em)
  #text(size: 9.5pt, fill: MUTED, style: "italic")[#cv.skills.at(view).join("  ·  ")]
]
