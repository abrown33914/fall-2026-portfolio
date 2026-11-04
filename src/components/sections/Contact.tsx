import { useState, type ReactNode, type SyntheticEvent } from 'react'
import { site } from '../../content/site'
import { cx } from '../../lib/accent'
import { track } from '../../lib/track'
import { SectionShell } from '../ui/Reveal'

/** Formspree form URL, set at build time (see .env.example). */
const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

type Status = 'idle' | 'sending' | 'success' | 'error'
type FieldErrors = { email?: string; message?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const field =
  'block w-full rounded-[14px] border border-hairline bg-surface-2 px-4 text-[16px] text-text placeholder:text-muted-2/70 outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_28%,transparent)] aria-[invalid=true]:border-[#d98b8b]'

const tile =
  'press flex min-h-[48px] items-center justify-center rounded-[14px] border border-hairline bg-fill-soft px-2 text-[14px] font-semibold text-text'

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-[6px] block text-[13px] font-medium text-muted">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-[6px] mb-0 text-[13px] text-[#e9a0a0]">
          {error}
        </p>
      )}
    </div>
  )
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div
      ref={(el) => el?.focus({ preventScroll: true })}
      tabIndex={-1}
      className="rounded-[22px] border border-hairline bg-surface p-6 outline-none focus-visible:outline-none"
    >
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[18px] text-accent"
      >
        ✓
      </span>
      <h3 className="mt-4 mb-0 text-[20px] font-bold tracking-[-0.02em]">Sent — thank you!</h3>
      <p className="mt-2 mb-0 text-[15px] leading-normal text-text-3">I’ll reply to the email you left.</p>
      <button
        type="button"
        onClick={onReset}
        className="press mt-5 min-h-[44px] cursor-pointer rounded-[14px] border border-hairline bg-fill-soft px-5 text-[14px] font-semibold text-text"
      >
        Send another
      </button>
    </div>
  )
}

function MessageForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    // Honeypot: real people never see this field. Pretend success so bots learn nothing.
    if (data.get('_gotcha')) {
      setStatus('success')
      return
    }

    const next: FieldErrors = {}
    if (!email) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(email)) next.email = 'That email doesn’t look right.'
    if (!message) next.message = 'Please write a message.'
    setErrors(next)
    if (next.email || next.message) {
      const first = form.elements.namedItem(next.email ? 'email' : 'message')
      if (first instanceof HTMLElement) first.focus()
      return
    }

    setStatus('sending')
    try {
      if (!ENDPOINT) throw new Error('Missing VITE_FORMSPREE_ENDPOINT')
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, message }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      track('contact-form-sent')
      setStatus('success')
    } catch (err) {
      console.error(err)
      track('contact-form-error')
      setStatus('error') // fields are uncontrolled, so what they typed stays put
    }
  }

  const sending = status === 'sending'

  return (
    <>
      {/* Always mounted so screen readers announce the change. */}
      <div aria-live="polite" role="status" className="sr-only">
        {status === 'success' && 'Message sent. Thank you!'}
      </div>

      {status === 'success' ? (
        <SuccessCard
          onReset={() => {
            setErrors({})
            setStatus('idle')
          }}
        />
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4" aria-label="Send me a message">
          <Field id="contact-email" label="Your email" error={errors.email}>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="you@company.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              readOnly={sending}
              className={cx(field, 'h-[52px]')}
            />
          </Field>

          <Field id="contact-message" label="Message" error={errors.message}>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              maxLength={2000}
              placeholder="Hi Allison — …"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              readOnly={sending}
              className={cx(field, 'resize-none py-[14px] leading-[1.5]')}
            />
          </Field>

          {/* Honeypot (spam bots fill every field). Hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Leave this empty
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div aria-live="polite" role="status">
            {status === 'error' && (
              <p className="m-0 rounded-[14px] border border-[#d98b8b]/40 bg-[#d98b8b]/10 px-4 py-3 text-[14px] leading-normal text-[#f0c4c4]">
                Something went wrong — email me directly at{' '}
                <a href={`mailto:${site.email}`} className="font-semibold text-text underline underline-offset-2">
                  {site.email}
                </a>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="press flex min-h-[52px] w-full cursor-pointer items-center justify-center rounded-[14px] bg-accent text-[16px] font-[650] tracking-[-0.01em] text-bg shadow-key disabled:cursor-default disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </>
  )
}

export function Contact() {
  return (
    <SectionShell
      id="contact"
      title="Contact"
      stickyTitle={false}
      gapMobile="gap-6"
      className="pb-10 md:pb-[120px]"
      intro={
        <p className="mt-3 mb-0 max-w-[34ch] text-[16.5px] leading-normal text-text-3">
          Seeking internships and new grad roles starting Summer 2027. Say hi!
        </p>
      }
    >
      <div className="relative flex w-full max-w-xl flex-col gap-8 md:mt-[6px]">
        <MessageForm />

        <div>
          <p className="mt-0 mb-3 text-[13px] font-medium text-muted">Or find me at</p>
          <div className="grid grid-cols-3 gap-[10px]">
            <a href={site.linkedin.href} target="_blank" rel="noopener noreferrer" data-umami-event="linkedin-click" className={tile}>
              LinkedIn
            </a>
            <a href={site.github.href} target="_blank" rel="noopener noreferrer" data-umami-event="github-click" className={tile}>
              GitHub
            </a>
            <a href={site.resume} download data-umami-event="resume-download" data-umami-event-from="contact" className={tile}>
              Résumé
            </a>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
