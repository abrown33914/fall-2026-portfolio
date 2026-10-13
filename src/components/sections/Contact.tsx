import { useEffect, useRef, useState, type ReactNode } from 'react'
import { site } from '../../content/site'
import { cx } from '../../lib/accent'
import { SectionShell } from '../ui/Reveal'

const row =
  'press flex h-[68px] w-full items-center justify-between rounded-[22px] text-text shadow-[inset_0_0_0_1px_rgba(230,224,214,.08)]'

function RowText({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col items-start gap-px">
      <span className="text-[12.5px] font-medium text-muted-2">{label}</span>
      <span className="max-w-full truncate text-[16.5px] font-bold">{value}</span>
    </span>
  )
}

function LinkRow({ href, label, value, icon, ...rest }: { href: string; label: string; value: string; icon: ReactNode; download?: boolean; target?: string; rel?: string }) {
  return (
    <a href={href} className={cx(row, 'bg-fill-soft px-[22px] hover:brightness-115')} {...rest}>
      <RowText label={label} value={value} />
      <span aria-hidden="true" className="text-[18px] text-accent">
        {icon}
      </span>
    </a>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
    } catch {
      // Clipboard unavailable (e.g. insecure context): fall back to the mail client.
      window.location.href = `mailto:${site.email}`
      return
    }
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <SectionShell
      id="contact"
      title="Contact"
      stickyTitle={false}
      gapMobile="gap-7"
      className="pb-10 md:pb-[120px]"
      intro={<p className="mt-3 mb-0 text-[16.5px] leading-normal text-text-3">Seeking internships and new graduate opportunities beginning Summer 2027<br />I’d love to connect!</p>}
    >
      <div className="flex max-w-[620px] flex-col gap-[10px] md:mt-[6px]">
        <button
          type="button"
          onClick={copy}
          className={cx(row, 'cursor-pointer pr-2 pl-[22px]', copied ? 'bg-accent text-bg' : 'bg-fill-soft')}
          aria-label={`Copy email address ${site.email}`}
        >
          <span className="flex min-w-0 flex-1 flex-col items-start gap-px">
            <span className="text-[12.5px] font-medium opacity-70">Email</span>
            <span className="max-w-full truncate text-[16.5px] font-bold">{site.email}</span>
          </span>
          <span
            className={cx(
              'flex h-[52px] items-center rounded-2xl px-5 text-[14px] font-[650] tracking-[-0.01em] transition-colors duration-300',
              copied ? 'bg-bg/12' : 'bg-text/10',
            )}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </span>
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>

        <LinkRow href={site.linkedin.href} label="LinkedIn" value={site.linkedin.label} icon="↗" target="_blank" rel="noopener noreferrer" />
        <LinkRow href={site.github.href} label="GitHub" value={site.github.label} icon="↗" target="_blank" rel="noopener noreferrer" />
        <LinkRow href={site.resume} label="Résumé" value="Download PDF" icon="↓" download />
      </div>
    </SectionShell>
  )
}
