import { useEffect, useLayoutEffect, useRef } from 'react'
import { onScrollFrame, onTick, type ScrollCallback, type TickCallback } from '../lib/frame'

/** Run `cb` once per frame while the page scrolls or resizes. Latest closure is always used. */
export function useScrollFrame(cb: ScrollCallback, enabled = true) {
  const ref = useRef(cb)
  useLayoutEffect(() => {
    ref.current = cb
  })
  useEffect(() => {
    if (!enabled) return
    return onScrollFrame((s) => ref.current(s))
  }, [enabled])
}

/** Run `cb` every animation frame while enabled (ambient motion). */
export function useTick(cb: TickCallback, enabled = true) {
  const ref = useRef(cb)
  useLayoutEffect(() => {
    ref.current = cb
  })
  useEffect(() => {
    if (!enabled) return
    return onTick((t, s) => ref.current(t, s))
  }, [enabled])
}
