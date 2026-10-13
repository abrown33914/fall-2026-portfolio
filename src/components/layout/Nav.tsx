import { useEffect, useRef, useState } from 'react'
import { sections, site } from '../../content/site'
import { useFocusTrap, useScrollLock } from '../../hooks/dialog'
import { useWide } from '../../hooks/media'
import { useActiveSection, useNavHidden } from '../../hooks/useNav'
import { cx } from '../../lib/accent'

const pill =
  'fixed left-1/2 z-10 flex items-center rounded-full border border-text/8 p-[6px] transition-transform duration-[450ms] ease-[var(--ease-out-soft)]'

const resumeBtn =
  'press flex items-center whitespace-nowrap rounded-full bg-accent px-[18px] text-[14px] font-[650] tracking-[-0.01em] text-bg shadow-key'

const abBtn =
  'press grid place-items-center rounded-full bg-bone font-extrabold tracking-[-0.04em] text-bg'

/** Floating top-center pill (desktop). */
function TopNav({ hidden, active }: { hidden: boolean; active: string | null }) {
  return (
    <nav
      aria-label="Primary"
      className={cx(pill, 'top-[18px] hidden gap-1 bg-[rgba(32,32,34,.92)] shadow-[0_12px_28px_rgba(0,0,0,.4)] md:flex')}
      style={{ transform: `translateX(-50%) translateY(${hidden ? '-110px' : '0'})` }}
    >
      <a href="#top" aria-label="Back to top" className={cx(abBtn, 'mr-1 size-[42px] text-[13px]')}>
        AB
      </a>
      {sections.map((s) => {
        const on = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={on ? 'location' : undefined}
            className={cx(
              'flex h-[42px] items-center rounded-full px-[14px] text-[14px] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-300 hover:bg-fill hover:text-white',
              on ? 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-white' : 'text-text-3',
            )}
          >
            {s.label}
          </a>
        )
      })}
      <a href={site.resume} download className={cx(resumeBtn, 'ml-1 h-[42px]')}>
        Résumé
      </a>
    </nav>
  )
}

/** Floating bottom pill + menu sheet (phones). */
function BottomNav({ hidden, active }: { hidden: boolean; active: string | null }) {
  const [menuState, setMenu] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  const wide = useWide()
  const menu = menuState && !wide // the sheet only exists on phones

  useFocusTrap(sheet, menu)
  useScrollLock(menu)

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <div className="md:hidden">
      <nav
        aria-label="Primary"
        className={cx(pill, 'bottom-[calc(20px+env(safe-area-inset-bottom))] gap-[6px] bg-[rgba(32,32,34,.78)] shadow-[0_12px_28px_rgba(0,0,0,.45)]')}
        style={{ transform: `translateX(-50%) translateY(${hidden && !menu ? '120px' : '0'})` }}
      >
        <a href="#top" aria-label="Back to top" className={cx(abBtn, 'size-[46px] text-[14px]')}>
          AB
        </a>
        <button
          type="button"
          onClick={() => setMenu(true)}
          aria-expanded={menu}
          aria-controls="mobile-menu"
          className="flex h-[46px] cursor-pointer items-center gap-[10px] rounded-full bg-transparent px-[18px] text-[14px] font-semibold text-text active:scale-[.97]"
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="h-[2px] w-4 rounded-[1px] bg-text" />
            <span className="h-[2px] w-4 rounded-[1px] bg-text" />
          </span>
          Menu
        </button>
        <a href={site.resume} download className={cx(resumeBtn, 'h-[46px]')}>
          Résumé
        </a>
      </nav>

      <div
        aria-hidden="true"
        onClick={() => setMenu(false)}
        className="fill-lv z-20 bg-[rgba(5,6,8,.6)] transition-opacity duration-[350ms]"
        style={{ opacity: menu ? 1 : 0, pointerEvents: menu ? 'auto' : 'none' }}
      />
      <div
        id="mobile-menu"
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Site sections"
        inert={!menu}
        className="fixed right-[10px] bottom-[calc(10px+env(safe-area-inset-bottom))] left-[10px] z-21 rounded-[34px] bg-surface-2 px-[10px] pt-[10px] pb-3 shadow-[0_-10px_40px_rgba(0,0,0,.4)] transition-transform duration-500 ease-[cubic-bezier(.2,.9,.25,1)]"
        style={{ transform: menu ? 'translateY(0)' : 'translateY(110%)' }}
      >
        <div aria-hidden="true" className="mx-auto mt-[2px] mb-2 h-[5px] w-10 rounded-[3px] bg-text/20" />
        <ul className="m-0 list-none p-0">
          {sections.map((s) => {
            const on = active === s.id
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setMenu(false)}
                  aria-current={on ? 'location' : undefined}
                  className={cx(
                    'flex h-14 items-center justify-between rounded-[18px] px-4 text-[21px] font-bold tracking-[-0.03em] active:bg-fill-soft',
                    on ? 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-accent' : 'text-text',
                  )}
                >
                  {s.menuLabel}
                  <span aria-hidden="true" className="text-[16px] text-muted">
                    →
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        <button
          type="button"
          onClick={() => setMenu(false)}
          className="sr-only focus:not-sr-only focus:mx-auto focus:mt-2 focus:block focus:rounded-full focus:px-4 focus:py-2"
        >
          Close menu
        </button>
      </div>
    </div>
  )
}

export function Nav() {
  const hidden = useNavHidden()
  const active = useActiveSection()
  return (
    <>
      <TopNav hidden={hidden} active={active} />
      <BottomNav hidden={hidden} active={active} />
    </>
  )
}
