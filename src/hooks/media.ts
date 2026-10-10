import { useSyncExternalStore } from 'react'

function useMatch(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}

/** Desktop layout: ≥ 900px (matches the Tailwind `md` breakpoint). */
export const useWide = () => useMatch('(min-width: 900px)')

export const useReducedMotion = () => useMatch('(prefers-reduced-motion: reduce)')
