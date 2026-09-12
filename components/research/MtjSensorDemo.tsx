"use client";
import { useRef } from "react";
import {
  R_PARALLEL,
  R_ANTIPARALLEL,
  TMR_RATIO,
  clampField,
  resistance,
  normalizedConductance,
} from "@/lib/mtj";
import { useFieldDrag } from "./useFieldDrag";
import MomentArrow from "./MomentArrow";

// Layout, in SVG user units (viewBox is 0 0 640 500).
const ORIGIN = { x: 320, y: 78 };
const MAX_DRAG = 110; // px of drag == |h| = 1.8, so saturation is visible
const STACK_CX = 320;
const FREE = { cy: 178, w: 260, h: 54 };
const BARRIER = { cy: 214, w: 260, h: 16 };
const PINNED = { cy: 250, w: 260, h: 54 };
const PIN_LAYER = { cy: 286, w: 260, h: 16 };

function RHCurve({ h }: { h: number }) {
  const w = 220;
  const height = 120;
  const pad = { l: 34, r: 10, t: 10, b: 24 };
  const plotW = w - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const hMin = -1.6, hMax = 1.6;

  const xOf = (hv: number) => pad.l + ((hv - hMin) / (hMax - hMin)) * plotW;
  const yOf = (r: number) => pad.t + (1 - (r - R_PARALLEL) / (R_ANTIPARALLEL - R_PARALLEL)) * plotH;

  const samples: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const hv = hMin + (i / 40) * (hMax - hMin);
    samples.push(`${xOf(hv).toFixed(1)},${yOf(resistance(hv)).toFixed(1)}`);
  }

  const hc = Math.max(hMin, Math.min(hMax, h));

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full max-w-[220px] text-gray-400">
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={height - pad.b} stroke="currentColor" strokeWidth={1} />
      <line x1={pad.l} y1={height - pad.b} x2={w - pad.r} y2={height - pad.b} stroke="currentColor" strokeWidth={1} />
      <text x={pad.l} y={height - pad.b + 14} fontSize={9} fill="currentColor">-1.6</text>
      <text x={w - pad.r} y={height - pad.b + 14} fontSize={9} textAnchor="end" fill="currentColor">+1.6</text>
      <text x={pad.l + plotW / 2} y={height - 2} fontSize={9} textAnchor="middle" fill="currentColor">
        field h (H / H&#8210;k)
      </text>
      <text x={0} y={pad.t + 4} fontSize={9} fill="currentColor">R&#8210;AP</text>
      <text x={0} y={height - pad.b} fontSize={9} fill="currentColor">R&#8210;P</text>
      <polyline points={samples.join(" ")} fill="none" stroke="#57534e" strokeWidth={1.75} />
      <circle cx={xOf(hc)} cy={yOf(resistance(hc))} r={4} fill="#b91c1c" />
    </svg>
  );
}

export default function MtjSensorDemo() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { drag, onPointerDown } = useFieldDrag(svgRef, ORIGIN, MAX_DRAG);

  // Only the component along the pinned-layer axis (x) matters — see lib/mtj.ts.
  const h = (drag.x / MAX_DRAG) * 1.8;
  const hClamped = clampField(h);
  // The free layer's true easy axis is *in-plane, perpendicular* to the
  // pinned layer — i.e. into/out of this side-view diagram, not up/down
  // through the film stack. Drawing that as a vertical arrow would read as
  // "points out of the film plane," which is a different (and wrong)
  // physical picture. So the arrow here only ever shows the projection onto
  // the visible (pinned-layer) axis — cos(theta), which is just `hClamped`
  // — as a length: it shrinks toward the middle as the true moment swings
  // into the invisible in-plane direction, and grows again as it swings
  // back out, but never rotates out of the page.
  const freeLayerProjection = hClamped;
  const r = resistance(h);
  const conductance = normalizedConductance(h);

  const state = hClamped > 0.85 ? "Parallel — low resistance" : hClamped < -0.85 ? "Antiparallel — high resistance" : "Intermediate";

  // Tunneling "particles": faster / more opaque as conductance increases.
  const nDots = 5;
  const period = 1.8 - conductance * 1.5; // seconds; faster when conductance is high

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr,220px]">
      <div className="rounded-2xl border p-4">
        <svg
          ref={svgRef}
          viewBox="0 0 640 340"
          className="w-full touch-none select-none"
        >
          <defs>
            <pattern id="hatch" width={6} height={6} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1={0} y1={0} x2={0} y2={6} stroke="#a8a29e" strokeWidth={2} />
            </pattern>
          </defs>

          {/* Pinning (antiferromagnetic) layer */}
          <rect x={STACK_CX - PIN_LAYER.w / 2} y={PIN_LAYER.cy - PIN_LAYER.h / 2} width={PIN_LAYER.w} height={PIN_LAYER.h} rx={4} fill="url(#hatch)" stroke="#a8a29e" />
          <text x={STACK_CX - PIN_LAYER.w / 2 - 12} y={PIN_LAYER.cy + 4} textAnchor="end" fontSize={12} fill="#78716c">
            Pinning layer (antiferromagnet)
          </text>

          {/* Pinned layer */}
          <rect x={STACK_CX - PINNED.w / 2} y={PINNED.cy - PINNED.h / 2} width={PINNED.w} height={PINNED.h} rx={8} fill="#94a3b8" />
          <text x={STACK_CX - PINNED.w / 2 - 12} y={PINNED.cy + 4} textAnchor="end" fontSize={13} fontWeight={600} fill="#334155">
            Pinned layer
          </text>
          <MomentArrow cx={STACK_CX} cy={PINNED.cy} angleRad={0} length={90} color="#1e293b" />

          {/* Barrier */}
          <rect x={STACK_CX - BARRIER.w / 2} y={BARRIER.cy - BARRIER.h / 2} width={BARRIER.w} height={BARRIER.h} fill="#dbeafe" stroke="#93c5fd" />
          <text x={STACK_CX - BARRIER.w / 2 - 12} y={BARRIER.cy + 4} textAnchor="end" fontSize={12} fill="#3b82f6">
            Barrier (MgO)
          </text>

          {/* Tunneling particles, drifting from free layer down through the barrier */}
          {Array.from({ length: nDots }).map((_, i) => (
            <circle
              key={i}
              cx={STACK_CX - 90 + i * 45}
              cy={FREE.cy + FREE.h / 2 - 4}
              r={3}
              fill="#2563eb"
              opacity={0.25 + conductance * 0.65}
            >
              <animate
                attributeName="cy"
                values={`${FREE.cy + FREE.h / 2 - 4};${PINNED.cy - PINNED.h / 2 + 4}`}
                dur={`${period}s`}
                begin={`${(i * period) / nDots}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Free layer */}
          <rect x={STACK_CX - FREE.w / 2} y={FREE.cy - FREE.h / 2} width={FREE.w} height={FREE.h} rx={8} fill="#fde68a" />
          <text x={STACK_CX - FREE.w / 2 - 12} y={FREE.cy + 4} textAnchor="end" fontSize={13} fontWeight={600} fill="#92400e">
            Free layer
          </text>
          <MomentArrow
            cx={STACK_CX}
            cy={FREE.cy}
            angleRad={freeLayerProjection >= 0 ? 0 : Math.PI}
            length={Math.max(10, Math.abs(freeLayerProjection) * 90)}
            color="#92400e"
          />

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
        <p className="mt-2 text-xs text-gray-500">
          Only the field component along the pinned layer's axis (horizontal) does anything —
          drag straight up or down and notice nothing changes. The free layer's arrow only ever
          shrinks and grows along that same horizontal axis rather than swinging out of it: its
          true easy axis is <em>in-plane but perpendicular</em> to the pinned layer — into/out of
          this side view, not up out of the film — so what's drawn is its projection onto the
          sensing axis, not a rotation you'd actually see from this angle. That perpendicular
          easy axis is also deliberate: it's the one geometry where the response to field is
          smooth and fully reversible, with no jumps (see <code>lib/mtj.ts</code>).
        </p>
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
          <div className="mt-3 text-xs text-gray-500">TMR ratio: {Math.round(TMR_RATIO * 100)}%</div>
        </div>

        <div className="rounded-2xl border p-4">
          <div className="mb-1 text-xs uppercase tracking-wide text-gray-500">R vs. applied field</div>
          <RHCurve h={h} />
        </div>
      </div>
    </div>
  );
}
