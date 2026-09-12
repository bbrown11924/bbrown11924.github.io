import type { ConsoleId } from "@/lib/consoles";

// Simple line-art sketches, not photos — each console's silhouette drawn as
// flat SVG shapes in a shared "sketchbook" style: a dark stroke, light
// gray fills, one small accent color per console. viewBoxes vary since the
// consoles themselves are such different shapes; each is centered by its
// wrapper in the page.

function Nes() {
  // One body shape with the cartridge-door color layered on top of its own
  // top edge (same rx, same width) rather than two separately-rounded
  // rectangles that don't quite line up.
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full">
      <rect x={16} y={26} width={168} height={56} rx={7} fill="#e7e5e4" stroke="#44403c" strokeWidth={2.5} />
      <path d="M16 33 a7 7 0 0 1 7 -7 h154 a7 7 0 0 1 7 7 v12 H16 Z" fill="#d6d3d1" stroke="#44403c" strokeWidth={2} />
      <rect x={38} y={29} width={112} height={9} rx={2} fill="#a8a29e" stroke="#44403c" strokeWidth={1.3} />
      <rect x={156} y={28} width={9} height={12} rx={1.5} fill="#a8a29e" stroke="#44403c" strokeWidth={1.3} />
      <rect x={30} y={62} width={15} height={8} rx={2} fill="#fff" stroke="#44403c" strokeWidth={1.3} />
      <rect x={52} y={62} width={15} height={8} rx={2} fill="#fff" stroke="#44403c" strokeWidth={1.3} />
      <circle cx={132} cy={66} r={4.5} fill="#b91c1c" stroke="#44403c" strokeWidth={1.3} />
      <rect x={148} y={62} width={16} height={7} rx={2} fill="#a8a29e" stroke="#44403c" strokeWidth={1.3} />
    </svg>
  );
}

function GameBoyAdvance() {
  // The original 2001 horizontal GBA — a simple rounded lozenge, not the
  // clamshell SP, so no hinge or fancy silhouette needed.
  return (
    <svg viewBox="0 0 200 100" className="h-full w-full">
      <rect x={14} y={18} width={172} height={64} rx={24} fill="#e7e5e4" stroke="#44403c" strokeWidth={2.5} />
      <rect x={48} y={28} width={60} height={44} rx={4} fill="#78716c" stroke="#44403c" strokeWidth={2} />
      <rect x={54} y={34} width={48} height={32} rx={2} fill="#bbf7d0" stroke="#44403c" strokeWidth={1.3} />
      <circle cx={116} cy={26} r={2.3} fill="#b91c1c" />
      <g stroke="#44403c" strokeWidth={1.3} fill="#a8a29e">
        <rect x={24} y={62} width={7} height={18} rx={1.3} />
        <rect x={17} y={69} width={21} height={7} rx={1.3} />
      </g>
      <circle cx={148} cy={68} r={7} fill="#f5f5f4" stroke="#44403c" strokeWidth={1.3} />
      <circle cx={163} cy={56} r={7} fill="#f5f5f4" stroke="#44403c" strokeWidth={1.3} />
      <rect x={70} y={76} width={14} height={4.5} rx={2.2} fill="#a8a29e" stroke="#44403c" strokeWidth={0.8} />
      <rect x={88} y={76} width={14} height={4.5} rx={2.2} fill="#a8a29e" stroke="#44403c" strokeWidth={0.8} />
    </svg>
  );
}

function Wii() {
  return (
    <svg viewBox="0 0 100 150" className="h-full w-full">
      <rect x={12} y={102} width={76} height={10} rx={3} fill="#d6d3d1" stroke="#44403c" strokeWidth={2} />
      <rect x={26} y={10} width={48} height={96} rx={8} fill="#fafaf9" stroke="#44403c" strokeWidth={2.5} />
      <rect x={45} y={22} width={10} height={70} rx={4} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <circle cx={50} cy={96} r={3} fill="#38bdf8" />
      <circle cx={38} cy={98} r={2.3} fill="#a8a29e" stroke="#44403c" strokeWidth={1} />
      <circle cx={62} cy={98} r={2.3} fill="#a8a29e" stroke="#44403c" strokeWidth={1} />
    </svg>
  );
}

function WiiU() {
  // The GamePad — more recognizable than the console box, which just looks
  // like a slightly bigger Wii.
  return (
    <svg viewBox="0 0 220 130" className="h-full w-full">
      <rect x={10} y={10} width={200} height={110} rx={18} fill="#f5f5f4" stroke="#44403c" strokeWidth={2.5} />
      <rect x={52} y={26} width={116} height={68} rx={4} fill="#78716c" stroke="#44403c" strokeWidth={2} />
      <rect x={58} y={32} width={104} height={56} rx={2} fill="#bae6fd" stroke="#44403c" strokeWidth={1.2} />
      <circle cx={32} cy={42} r={9} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <g stroke="#44403c" strokeWidth={1.3} fill="#a8a29e">
        <rect x={24} y={78} width={6} height={16} rx={1.2} />
        <rect x={18} y={84} width={18} height={6} rx={1.2} />
      </g>
      <circle cx={188} cy={42} r={9} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <g>
        <circle cx={196} cy={78} r={4} fill="#fff" stroke="#44403c" strokeWidth={1.2} />
        <circle cx={184} cy={82} r={4} fill="#fff" stroke="#44403c" strokeWidth={1.2} />
        <circle cx={196} cy={90} r={4} fill="#fff" stroke="#44403c" strokeWidth={1.2} />
        <circle cx={188} cy={86} r={4} fill="#fff" stroke="#44403c" strokeWidth={1.2} />
      </g>
      <circle cx={110} cy={106} r={4} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.2} />
    </svg>
  );
}

function Switch() {
  return (
    <svg viewBox="0 0 220 120" className="h-full w-full">
      <rect x={18} y={8} width={46} height={104} rx={13} fill="#60a5fa" fillOpacity={0.25} stroke="#44403c" strokeWidth={2.5} />
      <circle cx={41} cy={30} r={7} fill="#f5f5f4" stroke="#44403c" strokeWidth={1.5} />
      <circle cx={41} cy={78} r={3} fill="#78716c" />
      <circle cx={41} cy={90} r={3} fill="#78716c" />
      <rect x={68} y={14} width={84} height={92} rx={7} fill="#fafaf9" stroke="#44403c" strokeWidth={2.5} />
      <rect x={78} y={24} width={64} height={62} rx={3} fill="#e7e5e4" stroke="#44403c" strokeWidth={1.5} />
      <rect x={156} y={8} width={46} height={104} rx={13} fill="#f87171" fillOpacity={0.25} stroke="#44403c" strokeWidth={2.5} />
      <circle cx={179} cy={78} r={7} fill="#f5f5f4" stroke="#44403c" strokeWidth={1.5} />
      <circle cx={179} cy={30} r={3} fill="#78716c" />
      <circle cx={186} cy={37} r={3} fill="#78716c" />
      <circle cx={172} cy={37} r={3} fill="#78716c" />
      <circle cx={179} cy={44} r={3} fill="#78716c" />
    </svg>
  );
}

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

const ICONS: Record<ConsoleId, React.ComponentType> = {
  nes: Nes,
  gba: GameBoyAdvance,
  wii: Wii,
  wiiu: WiiU,
  switch: Switch,
  pc: Pc,
};

export default function ConsoleIcon({ id, className }: { id: ConsoleId; className?: string }) {
  const Icon = ICONS[id];
  return (
    <div className={className}>
      <Icon />
    </div>
  );
}
