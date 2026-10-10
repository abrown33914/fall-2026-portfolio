import { useEffect, useRef } from 'react'

/**
 * Section wrapper with the design's reveal (fade + rise 40px over 1s).
 * Hidden state only applies under `html.motion` (see index.css), and sections
 * already in the first viewport are shown immediately.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!document.documentElement.classList.contains('motion') || !('IntersectionObserver' in window)) {
      el.dataset.shown = ''
      return
    }
    if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
      el.dataset.shown = ''
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.shown = ''
          io.disconnect()
        }
      },
      { threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
