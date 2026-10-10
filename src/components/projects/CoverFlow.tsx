import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, type KeyboardEvent, type MouseEvent, type Ref } from 'react'
import type { Project } from '../../lib/types'
import { useReducedMotion } from '../../hooks/media'
import { CoverArt } from './CoverArt'

export type CoverFlowHandle = { go: (i: number, instant?: boolean) => void }

/** Geometry from the design, per breakpoint. */
const GEO = {
  narrow: { step: 150, cardW: 206, near: 112, far: 52, fade: 3, stageH: 350, glow: 300 },
  wide: { step: 200, cardW: 250, near: 170, far: 90, fade: 4, stageH: 440, glow: 420 },
}

type Props = {
  projects: Project[]
  cur: number
  wide: boolean
  onCurChange: (i: number) => void
  onOpen: (i: number) => void
  ref?: Ref<CoverFlowHandle>
}

/**
 * 3D cover-flow. An invisible horizontal scroll-snap track is the gesture surface
 * (native momentum + snapping on touch, trackpad and wheel); its scroll position
 * drives each card's transform.
 */
export function CoverFlow({ projects, cur, wide, onCurChange, onOpen, ref }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const g = wide ? GEO.wide : GEO.narrow
  const curRef = useRef(cur)
  useLayoutEffect(() => {
    curRef.current = cur
  }, [cur])

  const layout = useCallback(() => {
    const c = track.current
    const s = stage.current
    if (!c || !s) return
    const p = c.scrollLeft / g.step
    s.querySelectorAll<HTMLElement>('[data-card]').forEach((el, i) => {
      const k = i - p
      const ak = Math.abs(k)
      const sign = k < 0 ? -1 : 1
      const tx = sign * (Math.min(ak, 1) * g.near + Math.max(ak - 1, 0) * g.far)
      const ry = reduced ? 0 : -Math.max(-1, Math.min(1, k)) * 34
      const sc = 1 - Math.min(ak, 2) * 0.1
      const tz = -Math.min(ak, 3) * 70
      const op = Math.max(0, Math.min(1, g.fade - ak))
      el.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`
      el.style.zIndex = String(100 - Math.round(ak * 10))
      el.style.opacity = op.toFixed(3)
      el.style.visibility = op === 0 ? 'hidden' : 'visible' // skip backdrop-blur work for off-stage cards
      el.style.filter = `brightness(${(1 - Math.min(ak, 2) * 0.22).toFixed(3)})`
    })
    const next = Math.max(0, Math.min(projects.length - 1, Math.round(p)))
    if (next !== curRef.current) onCurChange(next)
  }, [g, reduced, projects.length, onCurChange])

  const go = useCallback(
    (i: number, instant = false) => {
      track.current?.scrollTo({ left: i * g.step, behavior: reduced || instant ? 'auto' : 'smooth' })
    },
    [g.step, reduced],
  )

  useImperativeHandle(ref, () => ({ go }), [go])

  // Re-sync when the breakpoint (and therefore the step) changes.
  useLayoutEffect(() => {
    go(curRef.current, true)
    layout()
  }, [go, layout])

  useEffect(() => {
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [layout])

  const onTrackClick = (e: MouseEvent) => {
    const c = track.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const half = g.cardW / 2
    if (Math.abs(dx) < half) onOpen(cur)
    else {
      const jump = Math.abs(dx) > half * 3.2 ? 2 : 1
      go(Math.max(0, Math.min(projects.length - 1, cur + Math.sign(dx) * jump)))
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(Math.min(projects.length - 1, cur + 1))
    else if (e.key === 'ArrowLeft') go(Math.max(0, cur - 1))
    else if (e.key === 'Home') go(0)
    else if (e.key === 'End') go(projects.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') onOpen(cur)
    else return
    e.preventDefault()
  }

  const p = projects[cur]

  return (
    <div className="relative mt-[14px]" style={{ height: g.stageH }}>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] rounded-full opacity-50 blur-[70px] transition-[background-color] duration-[800ms]"
        style={{ width: g.glow, height: g.glow, backgroundColor: p.cover.glow }}
      />

      <div ref={stage} aria-hidden="true" className="pointer-events-none absolute inset-0 [perspective:1000px]">
        {projects.map((proj, i) => (
          <div
            key={proj.slug}
            data-card
            className="absolute top-5 left-1/2 box-border rounded-[26px] border border-white/16 bg-white/9 px-[11px] pt-[11px] pb-[14px] shadow-[0_24px_50px_rgba(0,0,0,.4),inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-[16px] will-change-[transform,opacity]"
            style={{ width: g.cardW, marginLeft: -g.cardW / 2 }}
          >
            <CoverArt project={proj} num={String(i + 1).padStart(2, '0')} />
            <div className="mt-3 text-center text-[15.5px] leading-[1.2] font-bold tracking-[-0.02em] [overflow-wrap:anywhere]">
              {proj.title}
            </div>
            <div className="mt-[3px] text-center text-[12.5px] font-medium text-card-sub">{proj.role.split(' · ')[0]}</div>
          </div>
        ))}
      </div>

      <div
        ref={track}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects. Use left and right arrow keys to browse, Enter to open details."
        onScroll={layout}
        onClick={onTrackClick}
        onKeyDown={onKeyDown}
        className="no-scrollbar absolute inset-0 flex cursor-pointer snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-[26px] focus-visible:outline-offset-[-2px]"
        style={{ paddingInline: `calc(50% - ${g.step / 2}px)` }}
      >
        {projects.map((proj) => (
          <div key={proj.slug} className="h-full flex-none snap-center" style={{ width: g.step }} />
        ))}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`Project ${cur + 1} of ${projects.length}: ${p.title}`}
      </p>
    </div>
  )
}
