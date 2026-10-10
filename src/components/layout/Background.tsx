import { useRef } from 'react'
import { useScrollFrame, useTick } from '../../hooks/frame'
import { useReducedMotion } from '../../hooks/media'
import { accentAt } from '../../lib/accent'

const GLOWS = [
  'top-[-80px] left-[-100px] size-[min(520px,90vw)] bg-[#2A3A5C] opacity-55 blur-[90px]',
  'top-[35%] right-[-140px] size-[min(480px,85vw)] bg-[#5A2430] opacity-[.42] blur-[100px]',
  'bottom-[-120px] left-[10%] size-[min(460px,80vw)] bg-[#4F5A3A] opacity-[.32] blur-[100px]',
]

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Drives the scroll-linked --accent on <html>. Runs even with reduced motion (it's color, not movement). */
export function AccentDriver() {
  useScrollFrame(({ y, max }) => {
    document.documentElement.style.setProperty('--accent', accentAt(max > 0 ? y / max : 0))
  })
  return null
}

/** Fixed, slowly drifting glows + grain overlay. */
export function Background() {
  const refs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = useReducedMotion()

  useTick((t, { y }) => {
    refs.current.forEach((el, i) => {
      if (!el) return
      const x = Math.sin(t * 0.00025 + i * 2) * 50
      const dy = Math.cos(t * 0.0002 + i * 1.3) * 60 - ((y * (0.03 + i * 0.02)) % 400)
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`
    })
  }, !reduced)

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {GLOWS.map((cls, i) => (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            className={`absolute rounded-full will-change-transform ${cls}`}
          />
        ))}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[3] opacity-[.06]"
        style={{ backgroundImage: GRAIN }}
      />
    </>
  )
}
