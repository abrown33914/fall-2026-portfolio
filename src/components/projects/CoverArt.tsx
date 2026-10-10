import type { Project } from '../../lib/types'
import { cx } from '../../lib/accent'

/** Square cover in the project's palette color: kicker top-left, big number bottom-left, faint ring. */
export function CoverArt({
  project,
  num,
  size = 'card',
  label,
}: {
  project: Project
  num: string
  size?: 'card' | 'mini'
  /** Overrides the kicker (the sheet's mini cover says "Screenshot") */
  label?: string
}) {
  const { cover } = project
  const mini = size === 'mini'
  return (
    <div
      className={cx('relative aspect-square overflow-hidden', mini ? 'rounded-[14px]' : 'rounded-[17px]')}
      style={{ background: cover.color, color: cover.ink }}
    >
      {project.image ? (
        <img src={project.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.05)_0_1px,transparent_1px_9px)]" />
          {!mini && (
            <div
              className="absolute rounded-full border-[1.5px] border-current opacity-[.22]"
              style={{ width: cover.ring, height: cover.ring, left: cover.rx, top: cover.ry }}
            />
          )}
          <div
            className={cx(
              'absolute leading-[.8] font-extrabold tracking-[-0.06em]',
              mini ? 'bottom-2 left-3 text-[54px]' : 'bottom-[10px] left-[14px] text-[64px] opacity-[.92]',
            )}
          >
            {num}
          </div>
          <div
            className={cx(
              'absolute text-[11px] opacity-75',
              mini ? 'top-[10px] left-3 font-medium' : 'top-3 left-[14px] font-semibold',
            )}
          >
            {label ?? project.kicker}
          </div>
        </>
      )}
    </div>
  )
}
