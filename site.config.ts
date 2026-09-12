// Global site settings. This is the one place your name, tagline, nav bar
// entries, and contact links live — change it here and it updates everywhere.
//
// To add a new page to the main nav: create app/<route>/page.tsx (see
// CONTENT.md), then add a matching entry to `nav` below. Anything more
// personal/informal goes in `personalNav` instead, which renders as a
// dropdown so the nav bar stays uncluttered.
export const site = {
  name: "Benjamin J. Brown",
  role: "Ph.D. Candidate in Physics",
  tagline: "Magnetic tunnel junction sensors, vortex-state spintronics, and cryogenic instrumentation — Brown University",
  nav: [
    { href: "/", label: "Home" },
    { href: "/publications", label: "Publications" },
    { href: "/talks", label: "Talks" },
    { href: "/cv", label: "CV" },
    { href: "/contact", label: "Contact" },
  ],
  personalNav: {
    label: "Personal",
    items: [
      { href: "/parks", label: "National Parks" },
    ],
  },
  links: {
    email: "benjamin_brown1@brown.edu",
    scholar: "",
    orcid: "https://orcid.org/0000-0001-6347-9598",
    github: "",
    researchgate: "",
  },
};
