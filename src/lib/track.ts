/** Umami custom event. Safe no-op when the script is blocked or hasn't loaded. */
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void }
  }
}

export function track(event: string, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data)
  } catch {
    // analytics must never break the page
  }
}
