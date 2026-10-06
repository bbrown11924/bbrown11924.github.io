"use client";
import { useMemo, useRef, useState } from "react";
import { resistance, R_PARALLEL, R_ANTIPARALLEL, clampField } from "@/lib/mtj";
import { coreDisplacement, averageMagnetization, type Chirality } from "@/lib/vortex";
import { useFieldDrag } from "./useFieldDrag";
import MomentArrow from "./MomentArrow";

const DISK = { cx: 320, cy: 250, r: 150 };
const ORIGIN = { x: 320, y: 55 };
const MAX_DRAG = 110;
const SAT_FIELD = 1; // field magnitude (in drag-derived units) at which response ~saturates

// A grid of short tangential "compass needles" curling around the core,
// clipped to the disk — same visual language as the home page's vortex
// field, since it's the same physics.
const NEEDLE_SPACING = 22;
const NEEDLE_POINTS = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let y = DISK.cy - DISK.r; y <= DISK.cy + DISK.r; y += NEEDLE_SPACING) {
    for (let x = DISK.cx - DISK.r; x <= DISK.cx + DISK.r; x += NEEDLE_SPACING) {
      if (Math.hypot(x - DISK.cx, y - DISK.cy) <= DISK.r - 10) pts.push({ x, y });
    }
  }
  return pts;
})();

export default function VortexSensorDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { drag, onPointerDown } = useFieldDrag(svgRef, ORIGIN, MAX_DRAG);
  const [chirality, setChirality] = useState<Chirality>(1);

  const fieldX = (drag.x / MAX_DRAG) * 2.2;
  const fieldY = (drag.y / MAX_DRAG) * 2.2;
  const fieldMag = Math.hypot(fieldX, fieldY);

  const core = useMemo(
    () => coreDisplacement(fieldX, fieldY, chirality, SAT_FIELD),
    [fieldX, fieldY, chirality]
  );
  const avgM = useMemo(() => averageMagnetization(fieldX, fieldY, SAT_FIELD), [fieldX, fieldY]);

  const coreX = DISK.cx + core.x * DISK.r;
  const coreY = DISK.cy + core.y * DISK.r;

  // Same resistance law as the macrospin sensor — feed it the readout
  // (average magnetization) projected onto a horizontal sensing axis.
  const h = clampField(avgM.x);
  const r = resistance(avgM.x);
  const state = h > 0.85 ? "Near-parallel — low resistance" : h < -0.85 ? "Near-antiparallel — high resistance" : "Intermediate";

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr,220px]">
      <div className="rounded-2xl border p-4">
        <svg ref={svgRef} viewBox="0 0 640 460" className="w-full touch-none select-none">
          {/* Disk (free layer, top-down) */}
          <circle cx={DISK.cx} cy={DISK.cy} r={DISK.r} fill="#fde68a" stroke="#92400e" strokeWidth={2} />

          {/* Curling in-plane magnetization around the (displaced) core */}
          <g stroke="#92400e" strokeWidth={1.4} strokeLinecap="round" opacity={0.75}>
            {NEEDLE_POINTS.map((p, i) => {
              const dx = p.x - coreX;
              const dy = p.y - coreY;
              const dist = Math.hypot(dx, dy) || 1;
              const angle = Math.atan2(dy, dx) + chirality * (Math.PI / 2);
              const len = 8 + Math.min(6, 60 / dist);
              const lx = (Math.cos(angle) * len) / 2;
              const ly = (Math.sin(angle) * len) / 2;
              return <line key={i} x1={p.x - lx} y1={p.y - ly} x2={p.x + lx} y2={p.y + ly} />;
            })}
          </g>

          {/* Displacement vector from disk center to core */}
          <line x1={DISK.cx} y1={DISK.cy} x2={coreX} y2={coreY} stroke="#78716c" strokeWidth={1.5} strokeDasharray="3 4" />
          <circle cx={DISK.cx} cy={DISK.cy} r={3} fill="#78716c" />

          {/* The core itself — polarity shown as a filled dot (points toward viewer) */}
          <circle cx={coreX} cy={coreY} r={9} fill="#b91c1c" stroke="#7f1d1d" strokeWidth={1.5} />

          {/* Average magnetization — what a paired pinned layer would sense */}
          {fieldMag > 0.02 && (
            <MomentArrow
              cx={DISK.cx}
              cy={DISK.cy}
              // avgM is in the same y-down SVG space as everything else here;
              // MomentArrow expects a math-convention (y-up) angle and flips
              // it back internally, so negate y once, here, to round-trip.
              angleRad={Math.atan2(-avgM.y, avgM.x)}
              length={Math.hypot(avgM.x, avgM.y) * DISK.r * 0.9}
              color="#1d4ed8"
              width={3}
              anchor="start"
            />
          )}

          {/* Draggable applied-field handle */}
          <line x1={ORIGIN.x} y1={ORIGIN.y} x2={ORIGIN.x + drag.x} y2={ORIGIN.y + drag.y} stroke="#2563eb" strokeWidth={2.5} strokeDasharray="4 4" opacity={0.6} />
          <circle cx={ORIGIN.x} cy={ORIGIN.y} r={3} fill="#2563eb" opacity={0.5} />
          <g
            transform={`translate(${ORIGIN.x + drag.x},${ORIGIN.y + drag.y})`}
            onPointerDown={onPointerDown}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle r={16} fill="#2563eb" opacity={0.12} />
            <circle r={9} fill="#2563eb" />
          </g>
          <text x={ORIGIN.x} y={ORIGIN.y - 22} textAnchor="middle" fontSize={12} fontWeight={600} fill="#2563eb">
            Drag me — applied field
          </text>
        </svg>

        <div className="mt-2 flex items-center justify-between">
          <p className="max-w-md text-xs text-gray-500">
            The red dot is the vortex core — notice it moves <em>perpendicular</em> to the field
            you drag, not along it. The blue arrow is the disk's average magnetization (parallel
            to the field, as any linear sensor's readout should be).
          </p>
          <button
            type="button"
            onClick={() => setChirality((c) => (c === 1 ? -1 : 1))}
            className="ml-3 shrink-0 rounded-lg border px-2.5 py-1 text-xs font-medium hover:bg-gray-50"
          >
            Chirality: {chirality === 1 ? "CCW" : "CW"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border p-4">
          <div className="text-xs uppercase tracking-wide text-gray-500">Resistance</div>
          <div className="text-3xl font-bold tabular-nums">{Math.round(r).toLocaleString()} &Omega;</div>
          <div className="mt-1 text-sm text-gray-600">{state}</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full bg-gray-900 transition-[width]"
              style={{ width: `${((r - R_PARALLEL) / (R_ANTIPARALLEL - R_PARALLEL)) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>R-P {R_PARALLEL}&nbsp;&Omega;</span>
            <span>R-AP {R_ANTIPARALLEL}&nbsp;&Omega;</span>
          </div>
        </div>

        <div className="rounded-2xl border p-4 text-xs text-gray-500">
          <div className="mb-1 text-xs uppercase tracking-wide text-gray-500">Why a vortex</div>
          Vortex-state sensors trade the macrospin's sharp saturation for a wider linear range and
          a naturally non-hysteretic response — no easy-axis switching, just the core sliding
          around within the disk.
        </div>
      </div>
    </div>
  );
}
