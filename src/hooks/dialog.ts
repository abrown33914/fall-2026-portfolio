import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * While `active`: traps Tab inside `ref`, moves focus in, and returns focus to
 * whatever opened it when deactivated.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  const returnTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return
    const root = ref.current
    if (!root) return
    returnTo.current = document.activeElement as HTMLElement | null

    const items = () => [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
    // Wait a frame so `inert` has been removed before focusing.
    const id = requestAnimationFrame(() => (items()[0] ?? root).focus({ preventScroll: true }))

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(id)
      document.removeEventListener('keydown', onKey)
      returnTo.current?.focus({ preventScroll: true })
    }
  }, [active, ref])
}

/** Locks page scroll without layout shift from the disappearing scrollbar. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { body, documentElement } = document
    const gap = window.innerWidth - documentElement.clientWidth
    const prev = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = 'hidden'
    if (gap > 0) body.style.paddingRight = `${gap}px`
    return () => {
      body.style.overflow = prev.overflow
      body.style.paddingRight = prev.paddingRight
    }
  }, [locked])
}
