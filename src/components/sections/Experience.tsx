import { useRef } from 'react'
import { experience } from '../../content/experience'
import { docTop } from '../../lib/frame'
import { useScrollFrame } from '../../hooks/frame'
import { useReducedMotion } from '../../hooks/media'
import { SectionShell } from '../ui/Reveal'

export function Experience() {
  const list = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const lastP = useRef(-1)

  // Accent line grows to 62% of the viewport; dots fill as the line passes them.
  useScrollFrame(({ y, vh }) => {
    const tl = list.current
    const bar = fill.current
    if (!tl || !bar) return
    const h = tl.offsetHeight - 16
    const line = reduced ? Infinity : y + vh * 0.62 - docTop(tl)
    // scaleY on a full-height bar: compositor-only, unlike animating `height` (layout every frame).
    const p = h > 0 ? Math.max(0, Math.min(1, line / h)) : 0
    if (p !== lastP.current) {
      lastP.current = p
      bar.style.transform = `scaleY(${p.toFixed(4)})`
    }
    tl.querySelectorAll<HTMLElement>('[data-dot]').forEach((dot) => {
      const item = dot.parentElement as HTMLElement
      dot.toggleAttribute('data-on', line > item.offsetTop + 8)
    })
  })

  return (
    <SectionShell id="experience" title="Experience">
      <div className="relative max-w-[720px] pl-10">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-[2px] rounded-sm bg-hairline" />
        <div ref={fill} aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-[2px] origin-top scale-y-0 rounded-sm bg-accent will-change-transform" />
        <ol ref={list} className="relative m-0 list-none p-0">
          {experience.map((x) => (
            <li key={x.role + x.org} className="relative pb-[38px] last:pb-2">
              <span
                data-dot
                aria-hidden="true"
                className="absolute top-[6px] left-[-36px] box-border size-4 rounded-full border-2 border-accent bg-bg transition-[background-color,transform] duration-[400ms] ease-[cubic-bezier(.3,1.6,.5,1)] data-on:scale-[1.15] data-on:bg-accent"
              />
              <h3 className="m-0 text-[clamp(24px,2.2vw,30px)] leading-[1.12] font-bold tracking-[-0.035em]">
                {x.role}
              </h3>
              <p className="mt-[5px] mb-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-[16px] font-medium text-accent">{x.org}</span>
                <span className="text-[14px] font-medium text-muted">{x.dates}</span>
              </p>
              <p className="mt-[10px] mb-0 text-[16px] leading-[1.55] text-pretty text-text-3">{x.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  )
}
