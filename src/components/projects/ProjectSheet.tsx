import { useEffect, useRef, useState, type PointerEvent } from 'react'
import type { Project } from '../../lib/types'
import { useFocusTrap, useScrollLock } from '../../hooks/dialog'
import { useReducedMotion } from '../../hooks/media'
import { CoverArt } from './CoverArt'

type Props = {
  projects: Project[]
  index: number
  open: boolean
  wide: boolean
  onClose: () => void
  onStep: (dir: 1 | -1) => void
}

const prettyLink = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '')

/** Bottom sheet on phones (drag handle to dismiss), centered modal on desktop. */
export function ProjectSheet({ projects, index, open, wide, onClose, onStep }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)

  useFocusTrap(panel, open)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onStep])

  useEffect(() => {
    body.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [index, reduced])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (wide || (e.target as HTMLElement).closest('button')) return
    startY.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onMove = (e: PointerEvent) => dragging && setDrag(Math.max(0, e.clientY - startY.current))
  const onUp = () => {
    if (!dragging) return
    setDragging(false)
    if (drag > 110) onClose()
    setDrag(0)
  }

  const p = projects[index]
  const num = String(index + 1).padStart(2, '0')

  const transform = wide
    ? open
      ? 'translate(-50%,-50%)'
      : 'translate(-50%,calc(-50% + 40px)) scale(.97)'
    : open
      ? `translateY(${drag}px)`
      : 'translateY(103%)'

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className="fill-lv z-30 bg-[rgba(5,6,8,.62)] backdrop-blur-[4px] transition-opacity duration-[400ms]"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        inert={!open}
        tabIndex={-1}
        className="fixed inset-x-0 bottom-0 z-31 flex h-[91%] flex-col overflow-hidden rounded-t-[32px] bg-surface shadow-[0_-20px_60px_rgba(0,0,0,.5),inset_0_0_0_1px_rgba(230,224,214,.06)] outline-none md:inset-auto md:top-1/2 md:left-1/2 md:h-[min(86vh,880px)] md:w-[min(720px,92vw)] md:rounded-[32px]"
        style={{
          transform,
          opacity: wide ? (open ? 1 : 0) : 1,
          pointerEvents: open ? 'auto' : 'none',
          transition:
            dragging || reduced
              ? 'none'
              : 'transform .55s cubic-bezier(.2,.8,.2,1), opacity .35s ease',
        }}
      >
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="flex touch-none flex-col items-center px-5 pt-[10px] pb-[6px] max-md:cursor-grab"
        >
          <div aria-hidden="true" className="h-[5px] w-10 rounded-[3px] bg-text/22 md:invisible" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="mt-[2px] grid size-11 cursor-pointer place-items-center self-end rounded-full bg-fill text-[15px] text-text transition-[transform,filter] duration-[250ms] ease-[var(--ease-spring)] hover:rotate-90 hover:brightness-125 active:scale-[.97]"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div ref={body} className="no-scrollbar flex-1 overflow-y-auto px-5 pb-9 md:px-10">
          <div
            className="relative flex h-[230px] items-center justify-center overflow-hidden rounded-[30px] md:h-[300px]"
            style={{ background: `radial-gradient(120% 120% at 20% 20%, ${p.cover.color} 0%, #121212 80%)` }}
          >
            <div className="w-[176px] rounded-[22px] border border-white/18 bg-white/10 px-[9px] pt-[9px] pb-3 shadow-[0_18px_36px_rgba(0,0,0,.4)]">
              <CoverArt project={p} num={num} size="mini" label="Screenshot" />
            </div>
          </div>

          <p className="mt-6 mb-0 flex flex-wrap gap-x-3 text-[14px] font-medium">
            <span className="text-accent">{p.kicker}</span>
            <span className="text-muted">{p.period}</span>
            {p.status && <span className="text-muted">· {p.status}</span>}
          </p>
          <h3
            id="sheet-title"
            className="mt-1 mb-0 text-[clamp(30px,3vw,40px)] leading-[1.04] font-extrabold tracking-[-0.045em] [overflow-wrap:anywhere]"
          >
            {p.title}
          </h3>

          {p.award && (
            <p className="mt-3 mb-0 inline-flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-[14px] py-2 text-[13px] font-semibold text-[color-mix(in_srgb,var(--accent)_70%,#E6E0D6)]">
              <span aria-hidden="true">★</span>
              {p.award}
            </p>
          )}

          <p className="mt-3 mb-0 text-[16.5px] leading-[1.55] text-pretty text-text-2">{p.summary}</p>

          <ul className="mt-4 mb-0 flex list-none flex-col gap-2 p-0">
            {p.highlights.map((h) => (
              <li key={h} className="relative pl-5 text-[16px] leading-[1.5] text-text-3">
                <span aria-hidden="true" className="absolute top-[.6em] left-1 size-[6px] rounded-full bg-accent" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-1 gap-[18px] md:grid-cols-2">
            <div>
              <div className="text-[13px] font-medium text-muted">My role</div>
              <div className="mt-1 text-[16px] font-semibold">{p.role}</div>
            </div>
            <div>
              <div className="text-[13px] font-medium text-muted">Built with</div>
              <ul className="mt-[10px] mb-0 flex list-none flex-wrap gap-[6px] p-0">
                {p.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-[14px] py-2 text-[13px] font-semibold text-[color-mix(in_srgb,var(--accent)_70%,#E6E0D6)]"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {p.link && (
            <a
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-[26px] flex h-14 items-center justify-between gap-3 rounded-full bg-accent px-6 text-[15px] font-[650] tracking-[-0.01em] text-bg shadow-key"
            >
              <span>View project</span>
              <span className="truncate text-[13px] font-semibold">
                {prettyLink(p.link)} <span aria-hidden="true">↗</span>
              </span>
            </a>
          )}

          <div className={`flex gap-[10px] ${p.link ? 'mt-[10px]' : 'mt-[26px]'}`}>
            {[
              { dir: -1 as const, label: '← Previous' },
              { dir: 1 as const, label: 'Next →' },
            ].map((b) => (
              <button
                key={b.dir}
                type="button"
                onClick={() => onStep(b.dir)}
                className="press h-[52px] flex-1 cursor-pointer rounded-full bg-text/7 text-[14px] font-semibold text-text shadow-[inset_0_0_0_1px_rgba(230,224,214,.08)]"
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
