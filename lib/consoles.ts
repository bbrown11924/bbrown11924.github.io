// Ordered oldest to newest, then PC (the ongoing catch-all) and browser games. `id` must
// match a game's "console" field in data/games.json, and (except PC and browser) have
// a logo at public/consoles/<id>.svg.
export const CONSOLES = [
  { id: "nes", label: "Nintendo Entertainment System" },
  { id: "gba", label: "Game Boy Advance" },
  { id: "wii", label: "Wii" },
  { id: "wiiu", label: "Wii U" },
  { id: "switch", label: "Nintendo Switch" },
  { id: "pc", label: "PC (Steam)" },
  { id: "browser", label: "Browser Games" },
] as const;

export type ConsoleId = (typeof CONSOLES)[number]["id"];
