// Ordered oldest to newest, PC last as the ongoing catch-all. `id` must
// match a game's "console" field in data/games.json, and (except PC) have
// a logo at public/consoles/<id>.svg.
export const CONSOLES = [
  { id: "nes", label: "Nintendo Entertainment System" },
  { id: "gba", label: "Game Boy Advance" },
  { id: "wii", label: "Wii" },
  { id: "wiiu", label: "Wii U" },
  { id: "switch", label: "Nintendo Switch" },
  { id: "pc", label: "PC (Steam)" },
] as const;

export type ConsoleId = (typeof CONSOLES)[number]["id"];
