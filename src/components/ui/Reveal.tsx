import type { ReactNode } from 'react'
import { useReveal } from '../../hooks/useReveal'

/** Section with the shared desktop layout: sticky title column (240–340px) + content (max 720px). */
export function SectionShell({
  id,
  title,
  intro,
  stickyTitle = true,
  gapMobile = 'gap-7',
  className = '',
  children,
}: {
  id: string
  title: string
  intro?: ReactNode
  stickyTitle?: boolean
  gapMobile?: string
  className?: string
  children: ReactNode
}) {
  const ref = useReveal<HTMLElement>()
  return (
    <section
      ref={ref}
      id={id}
      data-reveal
      aria-labelledby={`${id}-title`}
      className={`container-page grid grid-cols-1 items-start pt-16 md:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] md:gap-12 md:pt-[120px] ${gapMobile} ${className}`}
    >
      <div className={stickyTitle ? 'md:sticky md:top-[110px]' : ''}>
        <h2 id={`${id}-title`} className="h-section">
          {title}
        </h2>
        {intro}
      </div>
      {children}
    </section>
  )
}
