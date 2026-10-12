import { useEffect, useRef } from 'react'
import { useScrollFrame } from '../../hooks/frame'
import { accentAt } from '../../lib/accent'

/**
 * Ambient colour: ONE fixed layer holding all three glows as radial gradients (no blur() filter,
 * no per-frame JS). The slow drift is a CSS transform animation, so it runs on the compositor
 * and costs nothing during scroll. Several large moving layers plus a backdrop-blurred nav
 * were what made scrolling stutter.
 */
const glow = (r: number, at: string, rgb: string, a: number) =>
  `radial-gradient(circle ${r}px at ${at}, rgba(${rgb},${a}) 0%, rgba(${rgb},${(a * 0.55).toFixed(2)}) 35%, rgba(${rgb},0) 100%)`

const GLOWS = [
  glow(620, '4% 2%', '42,58,92', 0.62),
  glow(580, '100% 42%', '90,36,48', 0.5),
  glow(540, '14% 100%', '79,90,58', 0.4),
].join(',')

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Drives the scroll-linked --accent on <html>. Runs even with reduced motion (it's color, not movement).
 * Changing an inherited custom property on the root restyles the whole page (~10ms a frame here),
 * so it is only written once scrolling pauses; the registered @property in index.css then
 * eases the colour over. Writing it every scroll frame was the main cause of scroll lag.
 */
export function AccentDriver() {
  const timer = useRef<number | undefined>(undefined)
  const first = useRef(true)
  useScrollFrame(({ y, max }) => {
    const apply = () => document.documentElement.style.setProperty('--accent', accentAt(max > 0 ? y / max : 0))
    window.clearTimeout(timer.current)
    if (first.current) {
      first.current = false
      apply()
    } else {
      timer.current = window.setTimeout(apply, 110)
    }
  })
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return null
}

/** Fixed ambient glows + grain overlay. */
export function Background() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-drift absolute -inset-[8%] will-change-transform" style={{ background: GLOWS }} />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[3] opacity-[.06]"
        style={{ backgroundImage: GRAIN }}
      />
    </>
  )
}
