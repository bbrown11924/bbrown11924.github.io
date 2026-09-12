/**
 * A magnetic vortex's response to an in-plane field, derived rather than
 * asserted — the standard (and genuinely non-obvious) result is that the
 * core displaces *perpendicular* to the applied field, not along it.
 *
 * Why: displacing a vortex core by a small vector X from the disk center
 * makes the surrounding curling texture slightly lopsided, and — this is
 * the key fact — the resulting *average* in-plane magnetization of that
 * lopsided texture is perpendicular to the displacement:
 *
 *   <m> ~ chirality * (z-hat x X)
 *
 * The Zeeman energy of that average moment in a field H is
 * E = -Ms*Vol * H . <m>. Balancing that against the parabolic confinement
 * energy that resists displacement, (kappa/2)|X|^2, the equilibrium
 * (dE_total/dX = 0) is
 *
 *   kappa * X = Ms*Vol * chirality * (z-hat x H)
 *   =>     X ~ chirality * (z-hat x H)
 *
 * — i.e. the core sits perpendicular to H: rotated +90 deg for a
 * counterclockwise curl (chirality +1), -90 deg for clockwise (-1).
 *
 * Apply the same z-hat-cross identity a second time (z-hat x (z-hat x H)
 * = -H, since H is in-plane) to the *first* relation above and you get
 * <m> ~ H directly: the average magnetization — the readout a paired
 * pinned layer actually senses — is parallel to the field, exactly like
 * any linear sensor should be, even though the core's physical position
 * is perpendicular to it. Both are true at once; that's the mechanism a
 * vortex sensor relies on.
 */

export type Chirality = 1 | -1;

/** Saturating response magnitude, 0..~1. A real core's approach to
 * annihilation is gradual, not a sharp corner, so this uses tanh rather
 * than a hard clamp. */
export function responseMagnitude(fieldMagnitude: number, satField = 1): number {
  return Math.tanh(fieldMagnitude / satField);
}

/** Core position relative to the disk center, as a fraction of disk radius. */
export function coreDisplacement(
  fieldX: number,
  fieldY: number,
  chirality: Chirality,
  satField = 1,
  maxFraction = 0.82 // stay short of the edge — full annihilation isn't modeled
) {
  const mag = Math.hypot(fieldX, fieldY);
  if (mag < 1e-6) return { x: 0, y: 0 };
  const frac = responseMagnitude(mag, satField) * maxFraction;
  const fieldAngle = Math.atan2(fieldY, fieldX);
  const coreAngle = fieldAngle + chirality * (Math.PI / 2);
  return { x: Math.cos(coreAngle) * frac, y: Math.sin(coreAngle) * frac };
}

/** Average in-plane magnetization (parallel to the field, saturating to
 * unit length) — what a paired pinned layer would actually sense. */
export function averageMagnetization(fieldX: number, fieldY: number, satField = 1) {
  const mag = Math.hypot(fieldX, fieldY);
  if (mag < 1e-6) return { x: 0, y: 0 };
  const frac = responseMagnitude(mag, satField);
  return { x: (fieldX / mag) * frac, y: (fieldY / mag) * frac };
}
