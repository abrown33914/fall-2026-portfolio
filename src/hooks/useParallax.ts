import { useRef } from 'react'
import { docTop } from '../lib/frame'
import { useScrollFrame } from './frame'
import { useReducedMotion } from './media'

/**
 * Vertical parallax: shifts the element by `factor` × scroll distance.
 * Elements that start above the fold move from page load; others from when they enter.
 */
export function useParallax<T extends HTMLElement>(factor: number) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  useScrollFrame(
    ({ y, vh }) => {
      const el = ref.current
      if (!el) return
      const top = docTop(el) // offsetTop ignores transforms, so this is stable
      const d = top < vh ? y : y - top + vh / 2
      el.style.transform = `translate3d(0, ${(d * factor).toFixed(1)}px, 0)`
    },
    !reduced,
  )

  return ref
}
