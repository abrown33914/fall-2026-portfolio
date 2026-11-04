import { useEffect, useRef, useState, type ReactNode, type SyntheticEvent } from 'react'
import { site } from '../../content/site'
import { cx } from '../../lib/accent'
import { track } from '../../lib/track'
import { SectionShell } from '../ui/Reveal'

/** Formspree form URL, set at build time (see .env.example). */
const ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined

const TOPICS = ['Internship', 'Full-time role', 'Project / collab', 'Just saying hi'] as const
const MAX = 500
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Status = 'idle' | 'sending' | 'success' | 'error'
type FieldErrors = { email?: string; message?: string }

const field =
  'block w-full rounded-[14px] border border-hairline bg-bg px-4 text-[16px] text-text placeholder:text-muted-2/70 outline-none transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_26%,transparent)] aria-[invalid=true]:border-[#d98b8b]'

const linkRow =
  'group -mx-3 flex min-h-[46px] items-center justify-between rounded-[14px] px-3 text-[15.5px] font-semibold text-text transition-[background-color,color] duration-200 hover:bg-fill hover:text-accent active:bg-fill focus-visible:bg-fill focus-visible:text-accent'

const arrow = 'text-accent transition-transform duration-200'

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-[6px] block text-[12.5px] font-medium text-muted">
      {children}
    </label>
  )
}

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null
  return (
    <p id={id} className="mt-[6px] mb-0 text-[13px] text-[#e9a0a0]">
      {children}
    </p>
  )
}

/** Left column: email (with copy) and profile links. */
function FindMe() {
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
    track('email-copy')
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mt-6 border-t border-hairline pt-5">
      <p className="mt-0 mb-2 text-[11.5px] font-medium tracking-[0.08em] text-muted uppercase">Or find me at</p>

      <div className="flex min-h-[46px] items-center justify-between gap-3">
        <span className="min-w-0 truncate text-[15.5px] font-semibold">{site.email}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy email address ${site.email}`}
          className={cx(
            'press min-h-[36px] shrink-0 cursor-pointer rounded-[10px] px-3 text-[13px] font-semibold transition-colors duration-300',
            copied ? 'bg-accent text-bg' : 'bg-fill text-text',
          )}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>
      </div>

      <a href={site.linkedin.href} target="_blank" rel="noopener noreferrer" data-umami-event="linkedin-click" className={linkRow}>
        LinkedIn
        <span aria-hidden="true" className={cx(arrow, 'group-hover:translate-x-[2px] group-hover:-translate-y-[2px]')}>
          ↗
        </span>
      </a>
      <a href={site.github.href} target="_blank" rel="noopener noreferrer" data-umami-event="github-click" className={linkRow}>
        GitHub
        <span aria-hidden="true" className={cx(arrow, 'group-hover:translate-x-[2px] group-hover:-translate-y-[2px]')}>
          ↗
        </span>
      </a>
      <a href={site.resume} download data-umami-event="resume-download" data-umami-event-from="contact" className={linkRow}>
        Résumé (PDF)
        <span aria-hidden="true" className={cx(arrow, 'group-hover:translate-y-[2px]')}>
          ↓
        </span>
      </a>
    </div>
  )
}

function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div ref={(el) => el?.focus({ preventScroll: true })} tabIndex={-1} style={{ outline: 'none' }} className="py-2">
      <span
        aria-hidden="true"
        className="grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[18px] text-accent"
      >
        ✓
      </span>
      <h3 className="mt-4 mb-0 text-[20px] font-bold tracking-[-0.02em]">Message sent — thank you!</h3>
      <p className="mt-2 mb-0 text-[15px] leading-normal text-text-3">It landed in my inbox. I’ll get back to you at the email you left.</p>
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

function MessageCard() {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('Internship')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [trap, setTrap] = useState('')

  const reset = () => {
    setErrors({})
    setTopic('Internship')
    setName('')
    setEmail('')
    setMessage('')
    setStatus('idle')
  }

  const submit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Honeypot: real people never see this field. Pretend success so bots learn nothing.
    if (trap) {
      setStatus('success')
      return
    }

    const next: FieldErrors = {}
    const em = email.trim()
    if (!em) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(em)) next.email = 'That email doesn’t look right.'
    if (!message.trim()) next.message = 'Please write a message.'
    setErrors(next)
    if (next.email || next.message) {
      const first = e.currentTarget.elements.namedItem(next.email ? 'email' : 'message')
      if (first instanceof HTMLElement) first.focus()
      return
    }

    setStatus('sending')
    try {
      if (!ENDPOINT) throw new Error('Missing VITE_FORMSPREE_ENDPOINT')
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: em,
          name: name.trim(),
          topic,
          message: message.trim(),
          _subject: `Portfolio message: ${topic}`,
        }),
      })
      if (!res.ok) throw new Error(`Formspree responded ${res.status}`)
      track('contact-form-sent', { topic })
      setStatus('success')
    } catch (err) {
      console.error(err)
      track('contact-form-error')
      setStatus('error') // state is kept, so what they typed stays put
    }
  }

  const sending = status === 'sending'

  return (
    <div className="relative rounded-[24px] border border-hairline bg-surface p-5 md:p-7">
      {/* Always mounted so screen readers announce the change. */}
      <div aria-live="polite" role="status" className="sr-only">
        {status === 'success' && 'Message sent. Thank you!'}
      </div>

      {status === 'success' ? (
        <SuccessCard onReset={reset} />
      ) : (
        <form onSubmit={submit} noValidate aria-labelledby="contact-form-title">
          <h3 id="contact-form-title" className="m-0 flex items-center gap-[10px] text-[18px] font-bold tracking-[-0.02em]">
            <span aria-hidden="true" className="size-[7px] rounded-full bg-accent" />
            Leave me a message
          </h3>

          <fieldset className="m-0 mt-5 min-w-0 border-0 p-0">
            <legend className="mb-2 p-0 text-[12.5px] font-medium text-muted">What’s this about?</legend>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={topic === t}
                    onChange={() => setTopic(t)}
                    className="peer sr-only"
                  />
                  <span className="press flex min-h-[40px] items-center rounded-full border border-hairline px-4 text-[13px] font-semibold text-text transition-colors duration-200 peer-checked:border-transparent peer-checked:bg-accent peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact-name">Name</Label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                readOnly={sending}
                className={cx(field, 'h-[52px]')}
              />
            </div>
            <div>
              <Label htmlFor="contact-email">Email</Label>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                readOnly={sending}
                className={cx(field, 'h-[52px]')}
              />
              <FieldError id="contact-email-error">{errors.email}</FieldError>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="contact-message">Message</Label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={6}
              maxLength={MAX}
              placeholder="Hi Allison — I came across your portfolio and…"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              readOnly={sending}
              className={cx(field, 'resize-none py-[14px] leading-[1.5]')}
            />
            <FieldError id="contact-message-error">{errors.message}</FieldError>
          </div>

          {/* Honeypot (spam bots fill every field). Hidden from people and assistive tech. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Leave this empty
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
            </label>
          </div>

          <div aria-live="polite" role="status">
            {status === 'error' && (
              <p className="mt-4 mb-0 rounded-[14px] border border-[#d98b8b]/40 bg-[#d98b8b]/10 px-4 py-3 text-[14px] leading-normal text-[#f0c4c4]">
                Something went wrong — email me directly at{' '}
                <a href={`mailto:${site.email}`} className="font-semibold text-text underline underline-offset-2">
                  {site.email}
                </a>
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[12.5px] text-muted-2 tabular-nums" aria-hidden="true">
              {message.length} / {MAX}
            </span>
            <button
              type="submit"
              disabled={sending}
              className="press flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-accent px-6 text-[15.5px] font-[650] tracking-[-0.01em] text-bg shadow-key disabled:cursor-default disabled:opacity-60 sm:w-auto"
            >
              {sending ? (
                'Sending…'
              ) : (
                <>
                  Send message <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export function Contact() {
  return (
    <SectionShell
      id="contact"
      title="Contact"
      stickyTitle={false}
      gapMobile="gap-6"
      className="pb-10 md:pb-[100px]"
      intro={
        <>
          <p className="mt-3 mb-0 max-w-[36ch] text-[16.5px] leading-normal text-text-3">
            Seeking internships and new graduate opportunities beginning Summer 2027. Say hi!
          </p>
          <FindMe />
        </>
      }
    >
      <div className="relative w-full max-w-[600px] md:mt-[6px]">
        <MessageCard />
      </div>
    </SectionShell>
  )
}
