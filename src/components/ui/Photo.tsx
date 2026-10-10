import type { CSSProperties, Ref } from 'react'
import { cx } from '../../lib/accent'

type Props = {
  /** Image path in /public. When omitted a hatched placeholder in `color` is shown. */
  src?: string
  alt: string
  /** Placeholder caption (only visible while there is no image) */
  label: string
  color: string
  className?: string
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  labelClassName?: string
}

export function Photo({ src, alt, label, color, className, style, ref, labelClassName }: Props) {
  return (
    <div
      ref={ref}
      className={cx('relative overflow-hidden', !src && 'hatch', className)}
      style={{ backgroundColor: color, ...style }}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span
          className={cx('absolute bottom-[14px] left-[14px] text-[12px] font-medium text-text/60', labelClassName)}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </div>
  )
}
