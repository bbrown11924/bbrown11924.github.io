type Game = { title: string; console: string; cover: string };

function GameCase({ game, tilt }: { game: Game; tilt: number }) {
  return (
    <div className="group relative shrink-0" style={{ transform: `rotate(${tilt}deg)` }}>
      {/* Fixed height, auto width — every cover keeps its real aspect ratio
          (some of these are square GBA boxes, some are 2:3 Steam capsules)
          rather than getting cropped to fit a fixed box. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.cover}
        alt={game.title}
        className="h-32 w-auto rounded-sm shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-out will-change-transform group-hover:z-10 group-hover:-translate-y-4 group-hover:rotate-0 group-hover:scale-110 group-hover:shadow-xl sm:h-36"
        loading="lazy"
      />
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity delay-100 group-hover:opacity-100">
        {game.title}
      </span>
    </div>
  );
}

export default function GameShelf({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="flex h-32 flex-1 items-center rounded-lg border border-dashed px-4 text-sm text-gray-400 sm:h-36">
        <p>Nothing on this shelf yet.</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-end gap-x-2 gap-y-6 px-1 pb-4 pt-6">
        {games.map((g, i) => (
          <GameCase key={g.title} game={g} tilt={i % 2 === 0 ? -1.5 : 1.5} />
        ))}
      </div>
      <div className="h-2 rounded-full bg-gradient-to-b from-gray-300 to-gray-200" />
    </div>
  );
}
