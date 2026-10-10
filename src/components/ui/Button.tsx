import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../lib/accent'

type Variant = 'primary' | 'ghost' | 'bone'
type Size = 'sm' | 'md' | 'lg'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-bg shadow-key font-[650]',
  ghost: 'bg-fill text-text ring-hair font-semibold',
  bone: 'bg-bone text-bg font-[650] shadow-[inset_0_1px_0_#fff,inset_0_-1px_0_rgba(0,0,0,.14)]',
}

const sizes: Record<Size, string> = {
  sm: 'h-[42px] px-[18px] text-[14px]',
  md: 'h-[46px] px-[18px] text-[14px]',
  lg: 'h-[54px] px-[26px] text-[15px]',
}

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode }
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'lg', className, children, ...rest } = props
  const cls = cx(
    'press inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full tracking-[-0.01em] cursor-pointer select-none',
    variants[variant],
    sizes[size],
    className,
  )
  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}

/** Round icon control (‹ › ✕). Always ≥ 44px. */
export function IconButton({
  label,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        'press grid size-[52px] shrink-0 cursor-pointer place-items-center rounded-full bg-fill text-[24px] leading-none font-medium text-text ring-hair',
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
}
