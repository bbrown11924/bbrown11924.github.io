import type { ConsoleId } from "@/lib/consoles";

// Each console is shown by its official logo (public/consoles/<id>.svg, from
// Wikimedia Commons, public domain) — except PC, which has no single logo and
// keeps a simple line-art sketch of a monitor and tower (and browser games a
// sketch of a browser window).

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

function Browser() {
  // Same sketch style as Pc(): a browser window with a tab, address bar, and a page.
  return (
    <svg viewBox="0 0 240 150" className="h-full w-full">
      <rect x={30} y={14} width={180} height={122} rx={7} fill="#fafaf9" stroke="#44403c" strokeWidth={2.5} />
      <path d="M30 36 h180" stroke="#44403c" strokeWidth={2} />
      <circle cx={44} cy={25} r={3.5} fill="#f87171" stroke="#44403c" strokeWidth={1} />
      <circle cx={56} cy={25} r={3.5} fill="#fbbf24" stroke="#44403c" strokeWidth={1} />
      <circle cx={68} cy={25} r={3.5} fill="#4ade80" stroke="#44403c" strokeWidth={1} />
      <rect x={84} y={19} width={110} height={12} rx={6} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <rect x={44} y={48} width={152} height={52} rx={3} fill="#78716c" />
      <rect x={44} y={110} width={92} height={7} rx={3} fill="#d6d3d1" />
      <rect x={44} y={122} width={64} height={7} rx={3} fill="#d6d3d1" />
    </svg>
  );
}

const LOGO_HEIGHT: Partial<Record<ConsoleId, string>> = {
  // Wide, short wordmarks get less height so they don't overpower the taller ones.
  gba: "h-5",
  ds: "h-6",
  nes: "h-14",
  switch: "h-20",
};

export default function ConsoleIcon({ id, label }: { id: ConsoleId; label: string }) {
  if (id === "pc" || id === "browser") {
    const Sketch = id === "pc" ? Pc : Browser;
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="h-20 w-36">
          <Sketch />
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
