import { about } from '../../content/site'
import { useParallax } from '../../hooks/useParallax'
import { Photo } from '../ui/Photo'
import { SectionShell } from '../ui/Reveal'

export function About() {
  const a = useParallax<HTMLDivElement>(-0.05)
  const b = useParallax<HTMLDivElement>(0.06)
  const [p1, p2, p3] = about.photos

  return (
    <SectionShell id="about" title="About">
      <div className="grid grid-cols-1 items-start gap-[26px] md:grid-cols-2 md:gap-10">
        <div className="grid grid-cols-[1.3fr_1fr] items-end gap-[10px]">
          <Photo ref={a} src={p1.image} alt="Allison Brown" label={p1.label} color={p1.color} className="aspect-[3/4] rounded-[26px]" />
          <div ref={b} className="flex flex-col gap-[10px]">
            <Photo
                src={p2.image}
              alt="Allison Brown, candid"
              label={p2.label}
              color={p2.color}
              className="aspect-[4/5] rounded-[22px]"
              labelClassName="left-3 bottom-3 text-[rgba(240,236,228,.75)]"
            />
            <Photo
              src={p3.image}
              alt="Allison Brown"
              label={p3.label}
              color={p3.color}
              className="aspect-[4/3] rounded-[22px]"
              labelClassName="left-3 bottom-3 text-[rgba(240,236,228,.75)]"
            />
          </div>
        </div>
        <div>
          <p className="m-0 text-[clamp(24px,2.1vw,30px)] leading-[1.28] font-semibold tracking-[-0.03em] text-pretty">
            {about.pull}
          </p>
          {about.bio.map((para, i) => (
            <p
              key={i}
              className={`${i ? 'mt-3' : 'mt-[18px]'} mb-0 text-[16.5px] leading-[1.6] text-pretty text-text-3`}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
