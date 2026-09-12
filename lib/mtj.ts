/**
 * A real (if simplified) macrospin model for a linear TMR sensor, not just a
 * cosmetic rotation. Two facts make this both simple *and* physically
 * accurate rather than a coincidence:
 *
 * 1. Real linear/orthogonal TMR sensors set the free layer's easy axis
 *    perpendicular to the pinned layer on purpose, and sense field applied
 *    along that perpendicular (hard) axis. Stoner-Wohlfarth theory says a
 *    field applied exactly along the hard axis gives a perfectly reversible
 *    (non-hysteretic) response — no jumps, no memory — which is exactly why
 *    real sensors are built this way, and exactly why this demo can use a
 *    single closed-form equilibrium instead of an iterative energy solver.
 *
 * 2. Minimizing E(theta) = (K/2)cos^2(theta) - Ms*H*cos(theta) — anisotropy
 *    (easy axis at theta=90 deg, theta measured from the pinned layer) plus
 *    Zeeman energy — gives dE/dtheta = sin(theta)*(Ms*H - K*cos(theta)) = 0,
 *    so for |h| <= 1 (h = Ms*H/K, the field in units of the anisotropy
 *    field): theta = acos(h). That's the whole model.
 *
 * Resistance follows the standard TMR angular dependence,
 * R(theta) = R_P + (R_AP - R_P) * (1 - cos(theta)) / 2, and since
 * cos(theta) = h here, R is just linear in h over the sensing range —
 * which is, again, the entire point of building a sensor this way.
 */

export const R_PARALLEL = 1000; // ohms, illustrative
export const R_ANTIPARALLEL = 2500; // ohms, illustrative — TMR = 150%
export const TMR_RATIO = (R_ANTIPARALLEL - R_PARALLEL) / R_PARALLEL;

/** Clamp h (field / anisotropy field) to the physically reversible range. */
export function clampField(h: number): number {
  return Math.max(-1, Math.min(1, h));
}

/** Free-layer angle from the pinned layer, in radians, always in [0, PI]. */
export function equilibriumAngle(h: number): number {
  return Math.acos(clampField(h));
}

/** Resistance for a given (unclamped) field; saturates outside |h| <= 1. */
export function resistance(h: number): number {
  const hc = clampField(h);
  return R_PARALLEL + (R_ANTIPARALLEL - R_PARALLEL) * (1 - hc) / 2;
}

/** Conductance (1/R), normalized to [0, 1] over the sensing range — drives
 * the tunneling-intensity visualization. */
export function normalizedConductance(h: number): number {
  const g = 1 / resistance(h);
  const gMin = 1 / R_ANTIPARALLEL;
  const gMax = 1 / R_PARALLEL;
  return (g - gMin) / (gMax - gMin);
}
