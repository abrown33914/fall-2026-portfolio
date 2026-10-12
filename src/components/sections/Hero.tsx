import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { floaters, site } from '../../content/site'
import { useTick } from '../../hooks/frame'
import { useReducedMotion } from '../../hooks/media'
import { useParallax } from '../../hooks/useParallax'
import { Button } from '../ui/Button'
import { Photo } from '../ui/Photo'

function AnimatedName() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const word = (w: string, offset: number) =>
    [...w].map((ch, i) => (
      <span key={i} className="name-letter" style={{ '--i': offset + i } as CSSProperties}>
        {ch}
      </span>
    ))

  return (
    <h1
      aria-label={`${site.firstName} ${site.lastName.replace(/\.$/, '')}`}
      className={`relative mt-[-92px] text-[clamp(72px,9.6vw,150px)] leading-[.86] font-extrabold tracking-[-0.06em] text-text md:mt-0 ${shown ? 'name-in' : ''}`}
    >
      <span aria-hidden="true" className="flex overflow-hidden pt-[2px] pb-[6px]">
        {word(site.firstName, 0)}
      </span>
      <span aria-hidden="true" className="flex overflow-hidden pb-[8px]">
        {word(site.lastName, 4)}
      </span>
    </h1>
  )
}

function RotatingBadge() {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduced = useReducedMotion()
  useTick((t, { y }) => {
    if (ref.current) ref.current.style.transform = `translateY(${y * -0.1}px) rotate(${t * 0.008 + y * 0.35}deg)`
  }, !reduced)

  return (
    <a
      ref={ref}
      href="#experience"
      aria-label="Scroll to experience"
      className="absolute top-[122px] left-[4px] block size-[96px] rounded-full bg-accent shadow-[0_14px_30px_rgba(0,0,0,.35)] will-change-transform md:top-[62%] md:left-[-54px] md:size-[128px]"
    >
      <svg viewBox="0 0 100 100" className="block size-full" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text fill="#121212" style={{ font: "700 8.6px 'Geist Variable', sans-serif" }}>
          <textPath href="#badge-circle" textLength="230" lengthAdjust="spacing">
            {site.badge}
          </textPath>
        </text>
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-[34%] grid place-items-center rounded-full bg-bg text-[13px] font-bold text-accent"
      >
        ↓
      </span>
    </a>
  )
}

function Floaters() {
  const wrap = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])
  const visible = useRef(true)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useTick((t, { y }) => {
    if (!visible.current) return
    items.current.forEach((el, i) => {
      if (!el) return
      const { p, rot } = floaters[i]
      const x = Math.sin(t * 0.00018 + p) * 14
      const dy = Math.cos(t * 0.00015 + p * 1.3) * 12 - y * (0.08 + (p % 1) * 0.1)
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${rot}deg)`
    })
  }, !reduced)

  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {floaters.map((f, i) => (
        <span
          key={f.t}
          ref={(el) => {
            items.current[i] = el
          }}
          className={`absolute top-(--my) left-(--mx) h-(--mh) opacity-[.07] md:top-(--y) md:left-(--x) md:h-(--h) ${f.mobile ? '' : 'max-md:hidden'}`}
          style={{
            '--x': f.x,
            '--y': f.y,
            '--mx': 'mx' in f ? f.mx : f.x,
            '--my': 'my' in f ? f.my : f.y,
            '--h': f.height,
            '--mh': 'mh' in f ? f.mh : f.height,
            aspectRatio: `${f.w} / ${f.h}`,
            transform: `rotate(${f.rot}deg)`,
          } as CSSProperties}
        >
          <img
            src={f.src}
            alt=""
            width={f.w}
            height={f.h}
            loading={i < 2 ? 'eager' : 'lazy'}
            fetchPriority={i < 2 ? 'high' : 'auto'}
            decoding="async"
            className="size-full object-contain [filter:brightness(0)_invert(.9)_sepia(.18)]"
          />
        </span>
      ))}
    </div>
  )
}

export function Hero() {
  const portrait = useParallax<HTMLDivElement>(0.1)

  return (
    <section
      id="top"
      className="relative mx-auto box-border max-w-[1240px] px-[22px] pt-[58px] pb-5 md:px-[var(--gutter)] md:pt-[120px] md:pb-10"
    >
      <Floaters />

      {/* Mobile résumé pill */}
      <div className="relative mb-4 flex justify-end md:hidden">
        <Button href={site.resume} variant="ghost" size="sm" download>
          Résumé <span className="text-accent" aria-hidden="true">↓</span>
        </Button>
      </div>

      <div className="relative flex flex-col items-stretch md:min-h-[min(760px,calc(100vh-160px))] md:flex-row md:items-center md:gap-14">
        <div className="relative z-[2] order-1 min-w-0 md:order-0 md:flex-1">
          <AnimatedName />
          <p className="mt-5 max-w-[480px] text-[clamp(18px,1.55vw,22px)] leading-[1.45] font-medium tracking-[-0.01em] text-pretty text-text-2">
            {site.lead}
          </p>
          <div className="mt-7 flex flex-wrap gap-[10px]">
            <Button href="#projects">See projects</Button>
            <Button href="#contact" variant="ghost" className="px-6">
              Contact
            </Button>
          </div>
        </div>

        <div className="relative order-0 h-[350px] w-full md:order-1 md:h-[min(560px,70vh)] md:flex-[0_0_min(440px,38vw)]">
          <div ref={portrait} className="absolute top-0 right-0 h-[330px] w-[262px] md:h-full md:w-full">
            {site.portrait ? (
              <Photo
                src={site.portrait}
                alt="Portrait of Allison Brown"
                label=""
                color="#1C2430"
                className="size-full rounded-[32px]"
              />
            ) : (
              <div
                className="relative size-full overflow-hidden rounded-[32px]"
                style={{
                  background:
                    'radial-gradient(90% 70% at 30% 25%, #3A4A72 0%, rgba(58,74,114,0) 60%), radial-gradient(80% 70% at 80% 85%, #5A2430 0%, rgba(90,36,48,0) 60%), #1C2430',
                }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(230,224,214,.04)_0_1px,transparent_1px_10px)]" />
                <span className="absolute inset-x-0 top-[46%] text-center text-[12px] font-medium text-text/55">
                  Portrait photo
                </span>
              </div>
            )}
          </div>
          <RotatingBadge />
        </div>
      </div>
    </section>
  )
}
