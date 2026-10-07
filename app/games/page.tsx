import type { Metadata } from "next";
import gamesRaw from "@/data/games.json";
import { CONSOLES, type ConsoleId } from "@/lib/consoles";
import ConsoleIcon from "@/components/games/ConsoleIcons";
import GameShelf from "@/components/games/GameShelf";

export const metadata: Metadata = { title: "Game Library" };

type Game = { title: string; console: string; cover: string };

export default function GamesPage() {
  const games = gamesRaw as Game[];

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Game Library</h1>
        <p className="max-w-2xl text-gray-600">
          Games I've played (and a few I'm nostalgic about), shelved by console. Hover one to pull
          it off the shelf.
        </p>
      </header>

      <div className="divide-y">
        {CONSOLES.map(({ id, label }: { id: ConsoleId; label: string }) => (
          <div key={id} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex w-full shrink-0 flex-col items-center gap-1 sm:w-36">
              <ConsoleIcon id={id} className="h-20 w-full text-stone-700" />
              <span className="text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
                {label}
              </span>
            </div>
            <GameShelf games={games.filter((g) => g.console === id)} />
          </div>
        ))}
      </div>
    </section>
  );
}
