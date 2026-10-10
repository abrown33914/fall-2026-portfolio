import { useRef, useState } from 'react'
import { sections, type SectionId } from '../content/site'
import { useScrollFrame } from './frame'

/** Hide floating nav while scrolling down past 240px; show again on scroll up. */
export function useNavHidden() {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useScrollFrame(({ y }) => {
    const down = y > lastY.current + 4
    const up = y < lastY.current - 4
    if (down && y > 240) setHidden(true)
    else if (up || y < 240) setHidden(false)
    if (down || up) lastY.current = y
  })
  return hidden
}

/** The last section whose top has crossed 55% of the viewport. */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)
  useScrollFrame(({ vh }) => {
    let current: SectionId | null = null
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el && el.getBoundingClientRect().top - vh * 0.55 <= 0) current = s.id
    }
    setActive(current)
  })
  return active
}
