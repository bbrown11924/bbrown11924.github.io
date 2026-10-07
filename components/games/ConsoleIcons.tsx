import type { ConsoleId } from "@/lib/consoles";

// Each console is shown by its official logo (public/consoles/<id>.svg, from
// Wikimedia Commons, public domain) — except PC, which has no single logo and
// keeps a simple line-art sketch of a monitor and tower.

function Pc() {
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full">
      <rect x={30} y={12} width={130} height={88} rx={6} fill="#fafaf9" stroke="#44403c" strokeWidth={2.5} />
      <rect x={40} y={22} width={110} height={68} rx={2} fill="#78716c" />
      <rect x={82} y={100} width={26} height={16} fill="#e7e5e4" stroke="#44403c" strokeWidth={2} />
      <rect x={58} y={116} width={74} height={8} rx={3} fill="#e7e5e4" stroke="#44403c" strokeWidth={2} />
      <rect x={178} y={38} width={46} height={90} rx={5} fill="#f5f5f4" stroke="#44403c" strokeWidth={2.5} />
      <circle cx={201} cy={50} r={3} fill="#4ade80" stroke="#44403c" strokeWidth={1} />
      <circle cx={201} cy={98} r={11} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <circle cx={201} cy={98} r={4} fill="#a8a29e" />
      <line x1={186} y1={118} x2={216} y2={118} stroke="#a8a29e" strokeWidth={1.5} />
    </svg>
  );
}

const LOGO_HEIGHT: Partial<Record<ConsoleId, string>> = {
  // Wide, short wordmarks get less height so they don't overpower the taller ones.
  gba: "h-5",
  nes: "h-14",
  switch: "h-20",
};

export default function ConsoleIcon({ id, label }: { id: ConsoleId; label: string }) {
  if (id === "pc") {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="h-20 w-36">
          <Pc />
        </div>
        <span className="text-center text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/consoles/${id}.svg`}
      alt={label}
      title={label}
      className={`${LOGO_HEIGHT[id] ?? "h-10"} w-auto max-w-full object-contain`}
    />
  );
}
