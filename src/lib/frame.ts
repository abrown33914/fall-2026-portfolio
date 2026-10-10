/**
 * One shared scheduler for everything scroll- or time-driven.
 * - Scroll subscribers run at most once per animation frame, from a single passive listener.
 * - Tick subscribers run every frame (ambient drift, badge spin) and stop when nobody listens.
 * Browsers already pause rAF in background tabs, so hidden tabs cost nothing.
 */
export type ScrollState = { y: number; vh: number; vw: number; max: number }
export type ScrollCallback = (s: ScrollState) => void
export type TickCallback = (t: number, s: ScrollState) => void

const scrollSubs = new Set<ScrollCallback>()
const tickSubs = new Set<TickCallback>()

let state: ScrollState = { y: 0, vh: 0, vw: 0, max: 0 }
let queued = false
let listening = false
let tickRaf = 0

function read() {
  const vh = window.innerHeight
  state = {
    y: window.scrollY,
    vh,
    vw: window.innerWidth,
    max: Math.max(0, document.documentElement.scrollHeight - vh),
  }
}

function flush() {
  queued = false
  read()
  scrollSubs.forEach((cb) => cb(state))
}

export function requestFlush() {
  if (queued) return
  queued = true
  requestAnimationFrame(flush)
}

function ensureListening() {
  if (listening) return
  listening = true
  read()
  window.addEventListener('scroll', requestFlush, { passive: true })
  window.addEventListener('resize', requestFlush)
  // Layout can change height after fonts/images load.
  new ResizeObserver(requestFlush).observe(document.documentElement)
}

export function onScrollFrame(cb: ScrollCallback) {
  ensureListening()
  scrollSubs.add(cb)
  requestFlush()
  return () => {
    scrollSubs.delete(cb)
  }
}

function loop(t: number) {
  tickSubs.forEach((cb) => cb(t, state))
  tickRaf = tickSubs.size ? requestAnimationFrame(loop) : 0
}

export function onTick(cb: TickCallback) {
  ensureListening()
  tickSubs.add(cb)
  if (!tickRaf) tickRaf = requestAnimationFrame(loop)
  return () => {
    tickSubs.delete(cb)
  }
}

export const getScrollState = () => state

/** Absolute document top of an element, ignoring any transform currently applied. */
export function docTop(el: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = el
  while (node) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}
