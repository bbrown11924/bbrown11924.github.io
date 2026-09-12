"use client";
import { useEffect, useRef } from "react";

/**
 * A field of tiny "compass needles" whose direction is the exact analytic
 * solution for a 2D point vortex (tangential everywhere, magnitude ~1/r) —
 * the same in-plane curling magnetization a real vortex-state magnetic
 * tunnel junction holds. The cursor acts as a local perturbation, the way a
 * real MTJ sensor's free layer responds to a nearby field.
 *
 * Pure canvas, no dependencies, ~a few hundred trig calls per frame.
 * Respects prefers-reduced-motion (renders one static frame, no RAF loop).
 */
export default function VortexField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const SPACING = 30;

    let width = 0;
    let height = 0;
    let points: { x: number; y: number }[] = [];
    let vortexOrigin = { x: 0, y: 0 };
    const mouse = { x: -9999, y: -9999, active: false };

    function layout() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      points = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          points.push({ x: offsetX + c * SPACING, y: offsetY + r * SPACING });
        }
      }
      vortexOrigin = { x: width * 0.66, y: height * 0.42 };
    }

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    layout();

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.active = x >= 0 && x <= width && y >= 0 && y <= height;
    }
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let t = 0;

    function frame() {
      t += reduceMotion ? 0 : 0.005;
      const vx = vortexOrigin.x + Math.sin(t * 0.6) * 22;
      const vy = vortexOrigin.y + Math.cos(t * 0.45) * 16;

      ctx!.clearRect(0, 0, width, height);

      for (const p of points) {
        const dx = p.x - vx;
        const dy = p.y - vy;
        const dist = Math.hypot(dx, dy) || 1;

        // Tangential unit vector around the vortex core (curl field).
        const vAngle = Math.atan2(dy, dx) + Math.PI / 2;
        let dirX = Math.cos(vAngle);
        let dirY = Math.sin(vAngle);

        const vortexIntensity = Math.min(1, 200 / dist);

        // Blend toward the cursor as a unit vector (never blend raw angles —
        // that breaks at the +-180 deg wraparound).
        let mouseIntensity = 0;
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy) || 1;
          mouseIntensity = Math.max(0, 1 - mdist / 150);
          if (mouseIntensity > 0) {
            const mAngle = Math.atan2(mdy, mdx);
            dirX = dirX * (1 - mouseIntensity) + Math.cos(mAngle) * mouseIntensity;
            dirY = dirY * (1 - mouseIntensity) + Math.sin(mAngle) * mouseIntensity;
          }
        }

        const angle = Math.atan2(dirY, dirX);
        const intensity = Math.max(vortexIntensity, mouseIntensity);
        const len = 5 + intensity * 6;
        const alpha = 0.14 + intensity * 0.4;

        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ctx!.strokeStyle = `rgba(68, 64, 60, ${alpha})`;
        ctx!.lineWidth = 1.3;
        ctx!.beginPath();
        ctx!.moveTo(p.x - cos * len * 0.5, p.y - sin * len * 0.5);
        ctx!.lineTo(p.x + cos * len * 0.5, p.y + sin * len * 0.5);
        ctx!.stroke();
      }

      ctx!.fillStyle = "rgba(68, 64, 60, 0.45)";
      ctx!.beginPath();
      ctx!.arc(vx, vy, 3.5, 0, Math.PI * 2);
      ctx!.fill();

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
