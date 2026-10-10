import { useEffect, useRef, useState, type RefObject } from 'react'
import { stats } from '../../content/site'
import type { Stat } from '../../lib/types'

const format = (s: Stat, v: number) => `${s.prefix ?? ''}${v.toFixed(s.decimals ?? 0)}${s.suffix ?? ''}`

/** Counts every numeric stat up from 0 over 1.3s (ease-out cubic) once 40% of the grid is visible. */
function useCountUp(ref: RefObject<HTMLElement | null>) {
  const animate = typeof document !== 'undefined' && document.documentElement.classList.contains('motion')
  const [progress, setProgress] = useState(animate ? 0 : 1)

  useEffect(() => {
    const el = ref.current
    if (!el || !animate) return
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1300)
          setProgress(1 - Math.pow(1 - p, 3))
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [ref, animate])

  return progress
}

export function Stats() {
  const ref = useRef<HTMLDListElement>(null)
  const progress = useCountUp(ref)

  return (
    <section aria-label="Highlights" className="container-page pt-[34px] md:pt-10">
      <dl ref={ref} className="m-0 grid grid-cols-2 border-t border-hairline md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={[
              'flex flex-col-reverse justify-end border-b border-hairline py-[18px] md:py-[26px]',
              i % 2 ? 'border-l pl-[18px]' : '',
              i > 0 ? 'md:border-l md:pl-7' : '',
            ].join(' ')}
          >
            <dt className="mt-2 text-[14.5px] leading-[1.3] font-semibold text-text-2">{s.label}</dt>
            <dd className="m-0 text-[clamp(44px,4.4vw,64px)] leading-none font-extrabold tracking-[-0.05em] text-accent tabular-nums">
              {s.text ?? (
                <>
                  <span aria-hidden="true">{format(s, (s.value ?? 0) * progress)}</span>
                  <span className="sr-only">{format(s, s.value ?? 0)}</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
