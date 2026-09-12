/**
 * A magnetization/field arrow for the research-page demos. `angleRad` is
 * measured counterclockwise from +x (standard math convention) — the
 * y-component is flipped internally for SVG's y-down screen space, so
 * callers never have to think about that.
 */
export default function MomentArrow({
  cx,
  cy,
  angleRad,
  length,
  color,
  width = 4,
  anchor = "center",
}: {
  cx: number;
  cy: number;
  angleRad: number;
  length: number;
  color: string;
  width?: number;
  /** "center": arrow spans length/2 on either side of (cx,cy) (a magnetic
   * moment sitting at that point). "start": arrow runs from (cx,cy)
   * outward (a vector anchored there, e.g. a displacement or field). */
  anchor?: "center" | "start";
}) {
  const dx = Math.cos(angleRad) * length;
  const dy = -Math.sin(angleRad) * length;
  const [x1, y1] = anchor === "center" ? [cx - dx / 2, cy - dy / 2] : [cx, cy];
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  const headAngle = Math.atan2(-dy, dx);
  const headLen = Math.min(10, length * 0.4);
  const hx1 = x2 - headLen * Math.cos(headAngle - 0.5);
  const hy1 = y2 + headLen * Math.sin(headAngle - 0.5);
  const hx2 = x2 - headLen * Math.cos(headAngle + 0.5);
  const hy2 = y2 + headLen * Math.sin(headAngle + 0.5);
  return (
    <g stroke={color} fill={color} strokeWidth={width} strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} stroke="none" />
    </g>
  );
}
