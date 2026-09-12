"use client";
import { useCallback, useEffect, useRef, useState } from "react";

function clientToSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}

/**
 * Shared "drag a field vector from an origin point" behavior for the
 * research-page demos. Returns the current drag offset (in SVG user units,
 * clamped to maxDrag) and the pointerdown handler to put on the handle.
 */
export function useFieldDrag(
  svgRef: React.RefObject<SVGSVGElement>,
  origin: { x: number; y: number },
  maxDrag: number
) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    try {
      (e.target as Element).setPointerCapture?.(e.pointerId);
    } catch {
      // Pointer capture is a nice-to-have; harmless to skip if unsupported.
    }
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!draggingRef.current || !svgRef.current) return;
      const p = clientToSvgPoint(svgRef.current, e.clientX, e.clientY);
      const dx = p.x - origin.x;
      const dy = p.y - origin.y;
      const dist = Math.hypot(dx, dy);
      const scale = dist > maxDrag ? maxDrag / dist : 1;
      setDrag({ x: dx * scale, y: dy * scale });
    }
    function onUp() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [svgRef, origin.x, origin.y, maxDrag]);

  return { drag, onPointerDown };
}
