import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { projects } from '../../content/projects'
import { useWide } from '../../hooks/media'
import { CoverFlow, type CoverFlowHandle } from '../projects/CoverFlow'
import { ProjectSheet } from '../projects/ProjectSheet'
import { Button, IconButton } from '../ui/Button'
import { useReveal } from '../../hooks/useReveal'
import { track } from '../../lib/track'

export function Projects() {
  const wide = useWide()
  const ref = useReveal<HTMLElement>()
  const flow = useRef<CoverFlowHandle>(null)
  const [cur, setCur] = useState(0)
  const [open, setOpen] = useState(false)
  const [idx, setIdx] = useState(0)
  const n = projects.length

  const go = (i: number) => flow.current?.go(((i % n) + n) % n)
  const openAt = useCallback((i: number) => {
    track('project-open', { project: projects[i].slug })
    setIdx(i)
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const step = useCallback(
    (d: 1 | -1) => {
      setIdx((i) => {
        const next = (i + d + n) % n
        flow.current?.go(next)
        return next
      })
    },
    [n],
  )

  return (
    <section
      ref={ref}
      id="projects"
      data-reveal
      aria-labelledby="projects-title"
      className="relative mx-auto box-border max-w-[1240px] pt-16 md:pt-[120px]"
    >
      <div className="flex items-end justify-between gap-4 px-[var(--gutter)]">
        <h2 id="projects-title" className="h-section">
          Projects
        </h2>
        <div className="hidden gap-2 md:flex">
          <IconButton label="Previous project" onClick={() => go(cur - 1)}>
            ‹
          </IconButton>
          <IconButton label="Next project" onClick={() => go(cur + 1)}>
            ›
          </IconButton>
        </div>
      </div>

      <CoverFlow ref={flow} projects={projects} cur={cur} wide={wide} onCurChange={setCur} onOpen={openAt} />

      <div className="mx-auto flex max-w-[520px] items-center justify-between gap-4 px-[var(--gutter)] md:justify-center">
        <IconButton label="Previous project" onClick={() => go(cur - 1)} className="size-12 text-[22px] ring-0 md:hidden">
          ‹
        </IconButton>
        <div className="flex items-center gap-[6px]" aria-hidden="true">
          {projects.map((p, i) => (
            <span
              key={p.slug}
              className="h-[6px] rounded-[3px] transition-[width,background-color] duration-300 ease-[cubic-bezier(.3,1.3,.5,1)]"
              style={{ width: i === cur ? 20 : 6, background: i === cur ? 'var(--accent)' : 'rgba(230,224,214,.22)' }}
            />
          ))}
        </div>
        <IconButton label="Next project" onClick={() => go(cur + 1)} className="size-12 text-[22px] ring-0 md:hidden">
          ›
        </IconButton>
      </div>

      <div className="mt-[18px] flex justify-center">
        <Button variant="bone" size="lg" className="h-[52px]" onClick={() => openAt(cur)} aria-haspopup="dialog">
          View project details
        </Button>
      </div>

      {createPortal(
        <ProjectSheet projects={projects} index={idx} open={open} wide={wide} onClose={close} onStep={step} />,
        document.body,
      )}
    </section>
  )
}
