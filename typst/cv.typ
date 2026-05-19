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
// View options: tech_leadership (default) | security_leadership

#let cv = yaml("../src/_data/cv.yml")
#let view = sys.inputs.at("view", default: "tech_leadership")

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

// Collapse runs of whitespace (including newlines from YAML literal blocks)
// into a single space so multi-line strings render as flowing paragraphs.
#let normalize(value) = {
  str(value).split(regex("\s+")).filter(p => p != "").join(" ")
}

#let role-title(role) = {
  let titles = role.at("titles", default: (:))
  titles.at(view, default: titles.at("default", default: ""))
}

#let bullets-for(role) = {
  role.at("bullets", default: ()).filter(b => view in b.at("audiences", default: ()))
}

#let capitalize(s) = upper(s.at(0)) + s.slice(1)

// ----------------------------------------------------------------------------
// theme
// ----------------------------------------------------------------------------

#let MUTED = rgb("#555")
#let RULE  = rgb("#bdbdbd")

// ----------------------------------------------------------------------------
// document
// ----------------------------------------------------------------------------

#set document(
  title: "Ryan Brooks — " + (if view == "security_leadership" { "Security leadership CV" } else { "CV" }),
  author: cv.profile.name,
)

#set page(
  paper: "a4",
  margin: (top: 14mm, bottom: 14mm, x: 16mm),
)

// Vendored fonts (typst/fonts/) come first so local and CI builds produce
// identical PDFs. System fonts kept as fallback for ad-hoc local compiles
// without --font-path.
#set text(
  font: ("IBM Plex Sans", "Helvetica Neue", "Helvetica", "Arial"),
  size: 9.75pt,
)

#set par(justify: false, leading: 0.5em, spacing: 0.55em)

// Headings ------------------------------------------------------------------
#show heading: set text(font: ("EB Garamond", "Iowan Old Style", "Garamond"), weight: "bold")
#show heading.where(level: 1): set text(size: 22pt)
#show heading.where(level: 1): it => block(below: 0.2em)[#it.body]

// Section headings (==): bold serif with a quiet underline rule.
#show heading.where(level: 2): it => block(
  above: 1.1em, below: 0.4em,
  stroke: (bottom: 0.5pt + RULE),
  inset: (bottom: 3pt),
  width: 100%,
)[
  #text(size: 12.5pt)[#it.body]
]

// Role titles (===)
#show heading.where(level: 3): it => block(above: 0.85em, below: 0.25em)[
  #text(size: 10.5pt)[#it.body]
]

// Lists ---------------------------------------------------------------------
#set list(indent: 0.8em, body-indent: 0.4em, spacing: 0.45em, marker: ([•], [◦]))

// Links: subtle underline, keep ink colour for readability.
#show link: it => underline(offset: 1.5pt, it)

// ----------------------------------------------------------------------------
// header
// ----------------------------------------------------------------------------

= #cv.profile.name

#text(fill: MUTED)[#cv.profile.location]

#(
  link(cv.profile.links.website)[Website],
  link(cv.profile.links.mastodon)[Mastodon],
  link(cv.profile.links.github)[GitHub],
  link(cv.profile.links.linkedin)[LinkedIn],
).join([ #h(0.4em) · #h(0.4em) ])

#if cv.profile.at("print_only", default: none) != none [
  #cv.profile.print_only.phone #h(0.4em) · #h(0.4em) #link("mailto:" + cv.profile.print_only.email)[#cv.profile.print_only.email]
]

#v(0.6em)
#line(length: 100%, stroke: 0.5pt + RULE)
#v(0.4em)

// ----------------------------------------------------------------------------
// statement
// ----------------------------------------------------------------------------

#cv.statements.at(view)

// ----------------------------------------------------------------------------
// skills
// ----------------------------------------------------------------------------

== Key skills

#text(fill: MUTED)[#cv.skills.at(view).join(" · ")]

// ----------------------------------------------------------------------------
// experience
// ----------------------------------------------------------------------------

== Experience

#for role in cv.experience [
  // Keep the role header (title + company + dates) together so a role never
  // splits with just a title at the bottom of a page.
  #block(breakable: false)[
    === #role-title(role)
    #text(weight: "semibold")[#role.company]#if role.at("type", default: none) != none [#text(fill: MUTED)[ · #role.type]]#if role.at("location", default: none) != none [#text(fill: MUTED)[ · #role.location]] \
    #text(fill: MUTED, size: 9pt)[#month-year(role.start) – #month-year(role.at("end", default: "present"))]
  ]

  #if role.at("summary", default: none) != none [
    #normalize(role.summary)
  ]

  #let bs = bullets-for(role)
  #if bs.len() > 0 [
    #list(..bs.map(b => normalize(b.text)))
  ]
]

// ----------------------------------------------------------------------------
// earlier career
// ----------------------------------------------------------------------------

#if cv.at("career_history", default: ()).len() > 0 [
  == Earlier career

  #for r in cv.career_history [
    - #text(weight: "semibold")[#r.role], #r.company#if r.at("location", default: none) != none [, #r.location] #text(fill: MUTED)[(#month-year(r.start) – #month-year(r.end))]
  ]
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
  [#text(weight: "semibold")[#capitalize(c.kind)]: #name #text(fill: MUTED)[#dates]#if note != none [#linebreak()#text(size: 8.5pt, fill: MUTED)[#note]]]
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
