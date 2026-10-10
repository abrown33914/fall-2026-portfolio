/** periwinkle → rose → lilac → sage → mint */
const STOPS: [number, number, number][] = [
  [180, 195, 242],
  [232, 169, 180],
  [205, 180, 230],
  [188, 199, 154],
  [168, 212, 198],
]

/** Smoothstep-interpolated accent for scroll progress p ∈ [0, 1]. */
export function accentAt(p: number) {
  const n = STOPS.length - 1
  const x = Math.max(0, Math.min(1, p)) * n
  const i = Math.min(n - 1, Math.floor(x))
  const f = x - i
  const e = f * f * (3 - 2 * f)
  const a = STOPS[i]
  const b = STOPS[i + 1]
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * e)).join(',')})`
}

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')
