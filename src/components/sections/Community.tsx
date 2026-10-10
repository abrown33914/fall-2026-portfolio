import { useState } from 'react'
import { community } from '../../content/community'
import { Photo } from '../ui/Photo'
import { SectionShell } from '../ui/Reveal'

/** Accordion: one row open at a time, first open by default. */
export function Community() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <SectionShell id="community" title="Campus & Community" gapMobile="gap-[10px]">
      <div className="max-w-[720px]">
        {community.map((c, i) => {
          const on = openIdx === i
          const btnId = `comm-btn-${i}`
          const panelId = `comm-panel-${i}`
          return (
            <div key={c.name} className="border-b border-hairline">
              <h3 className="m-0">
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={on}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(on ? -1 : i)}
                  className="flex min-h-[76px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent py-4 text-left text-text transition-opacity duration-200 hover:opacity-85 active:opacity-70"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-[clamp(21px,2vw,26px)] leading-[1.1] font-bold tracking-[-0.03em]">{c.name}</span>
                    <span className="text-[14px] font-semibold text-accent">{c.role}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-[42px] flex-none place-items-center rounded-full text-[22px] leading-none font-normal transition-[transform,background-color,color] duration-[400ms] ease-[var(--ease-spring)]"
                    style={{
                      background: on ? 'var(--accent)' : 'rgba(230,224,214,.08)',
                      color: on ? '#121212' : '#E6E0D6',
                      transform: `rotate(${on ? 45 : 0}deg)`,
                    }}
                  >
                    +
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                inert={!on}
                className="grid transition-[grid-template-rows] duration-[450ms] ease-[var(--ease-out-soft)]"
                style={{ gridTemplateRows: on ? '1fr' : '0fr' }}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="m-0 text-[16px] leading-[1.55] text-pretty text-text-3">{c.desc}</p>
                  <Photo
                    src={c.image}
                    alt={`${c.name} event`}
                    label={c.photoLabel}
                    color={c.color}
                    className="mt-[14px] mb-[22px] h-[150px] rounded-[22px] md:h-[220px]"
                    labelClassName="left-4 text-text/65"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
