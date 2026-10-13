import { useEffect, useRef } from 'react'
import { useScrollFrame } from '../../hooks/frame'
import { accentAt } from '../../lib/accent'

/**
 * Drives the scroll-linked --accent on <html>. Runs even with reduced motion (it's color, not movement).
 * Changing an inherited custom property on the root restyles the whole page (~10ms a frame here),
 * so it is only written once scrolling pauses; the registered @property in index.css then
 * eases the colour over. Writing it every scroll frame was the main cause of scroll lag.
 */
export function AccentDriver() {
  const timer = useRef<number | undefined>(undefined)
  const first = useRef(true)
  useScrollFrame(({ y, max }) => {
    const apply = () => document.documentElement.style.setProperty('--accent', accentAt(max > 0 ? y / max : 0))
    window.clearTimeout(timer.current)
    if (first.current) {
      first.current = false
      apply()
    } else {
      timer.current = window.setTimeout(apply, 110)
    }
  })
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return null
}
