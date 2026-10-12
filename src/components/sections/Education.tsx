import { education } from '../../content/site'
import { SectionShell } from '../ui/Reveal'

export function Education() {
  return (
    <SectionShell id="education" title="Education" stickyTitle={false}>
      <div className="flex items-start gap-[18px]">
        <div aria-hidden="true" className="grid size-16 flex-none place-items-center rounded-[18px] bg-text/7">
          <img src="/logos/trim/eagle.png" alt="" width={400} height={286} className="w-[44px] opacity-90" />
        </div>
        <div className="min-w-0">
          <h3 className="m-0 text-[clamp(22px,2.2vw,30px)] leading-[1.15] font-bold tracking-[-0.03em]">
            {education.degree}
          </h3>
          <p className="mt-[5px] mb-0 text-[16px] font-semibold text-accent">{education.school}</p>
          <p className="mt-[6px] mb-0 text-[16px] text-text-3">{education.detail}</p>
          <ul className="mt-4 mb-0 flex list-none flex-wrap gap-[6px] p-0">
            {education.honors.map((h) => (
              <li key={h} className="rounded-full bg-fill-soft px-[14px] py-2 text-[13px] font-semibold text-text-2 ring-hair">
                {h}
              </li>
            ))}
          </ul>
          <p className="mt-4 mb-0 text-[14px] font-medium text-muted">{education.previous}</p>
        </div>
      </div>
    </SectionShell>
  )
}
