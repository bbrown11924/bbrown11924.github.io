// Global site settings. This is the one place your name, tagline, nav bar
// entries, and contact links live — change it here and it updates everywhere.
//
// The nav bar is a row of dropdown groups. To add a new page: create
// app/<route>/page.tsx (see CONTENT.md), then add a matching entry to the
// right group's `items` below. Add a whole new group by adding another
// `{ label, items }` entry to `navGroups`.
export const site = {
  name: "Benjamin J. Brown",
  role: "Ph.D. Candidate in Physics",
  url: "https://bbrown11924.github.io",
  tagline: "Magnetic tunnel junction sensors, vortex-state spintronics, and cryogenic instrumentation — Brown University",
  navGroups: [
    {
      label: "Professional",
      items: [
        { href: "/", label: "Home" },
        { href: "/research", label: "Research" },
        { href: "/publications", label: "Publications" },
        { href: "/talks", label: "Talks" },
        { href: "/cv", label: "CV" },
        { href: "/contact", label: "Contact" },
      ],
    },
    {
      label: "Personal",
      items: [
        { href: "/parks", label: "National Parks" },
        { href: "/games", label: "Game Library" },
      ],
    },
  ],
  links: {
    email: "benjamin_brown1@brown.edu",
    scholar: "https://scholar.google.com/citations?user=0VC1h4IAAAAJ",
    orcid: "https://orcid.org/0000-0001-6347-9598",
    github: "",
    researchgate: "https://www.researchgate.net/profile/Benjamin-Brown-38",
  },
};
