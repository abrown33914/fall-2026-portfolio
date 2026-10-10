import type { Stat } from '../lib/types'

export const site = {
  firstName: 'Allison',
  lastName: 'Brown.',
  fullName: 'Allison Brown',
  lead: 'Software engineer who builds the tools, runs the hackathons, and leads the teams that ship.',
  badge: 'SOFTWARE ENGINEER · CLASS OF 2027 ·',
  email: 'abrown33914@gmail.com',
  linkedin: { label: 'linkedin.com/in/abrown27', href: 'https://www.linkedin.com/in/abrown27' },
  github: { label: 'github.com/abrown33914', href: 'https://github.com/abrown33914' },
  /** Drop your one-page résumé at public/AllisonBrown_Resume.pdf */
  resume: '/AllisonBrown_Resume.pdf',
  /** Hero portrait in /public/images; leave undefined to show the styled placeholder. */
  portrait: undefined as string | undefined,
} as const

/** Names that drift behind the hero at ~7% opacity. Plain text only (no agency seals). */
export const floaters = [
  { t: 'HSI', x: '-2%', y: '14%', size: 'clamp(64px,7vw,110px)', rot: -8, p: 0 },
  { t: 'EagleHacks', x: '38%', y: '6%', size: 'clamp(30px,3vw,48px)', rot: 6, p: 1.4 },
  { t: 'FGCU', x: '62%', y: '58%', size: 'clamp(52px,5vw,84px)', rot: -5, p: 2.6 },
  { t: 'INIT', x: '3%', y: '66%', size: 'clamp(40px,4vw,64px)', rot: 9, p: 3.3 },
  { t: 'CSSEC', x: '50%', y: '84%', size: 'clamp(34px,3.4vw,54px)', rot: -10, p: 4.1 },
  { t: 'Whitaker', x: '78%', y: '18%', size: 'clamp(44px,4vw,66px)', rot: 4, p: 5.2 },
]

export const stats: Stat[] = [
  { value: 23, prefix: '$', suffix: 'K+', label: 'Raised in hackathon sponsorships' },
  { value: 100, suffix: '+', label: 'EagleHacks participants' },
  { text: 'Winner', label: 'Google Cloud ADK Challenge, ShellHacks 2025' },
  { value: 3.76, decimals: 2, label: 'GPA · Dean’s List 4×' },
]

export const about = {
  pull: 'I like building software, and I like building the room around it even more.',
  bio: [
    'I’m a senior in Software Engineering at Florida Gulf Coast University, graduating in May 2027. I’ve built mobile features at a music startup, interned with Homeland Security Investigations, and now lead my senior project team.',
    'Outside of class I started EagleHacks and INIT FGCU. I’m drawn to mission-driven work in security and forensics, and to the coordination side of engineering: keeping people, timelines, and systems moving in the same direction.',
  ],
  photos: [
    { label: 'Photo of you', color: '#4B1E23', image: undefined as string | undefined },
    { label: 'Candid', color: '#6B6F4E', image: undefined as string | undefined },
  ],
}

export const education = {
  degree: 'B.S. Software Engineering',
  school: 'Florida Gulf Coast University',
  detail: 'Whitaker College of Engineering · Expected May 2027',
  honors: ['GPA 3.76', 'Dean’s List 4×', 'President’s List 2×', 'First-generation student'],
  previous: 'A.A., Honors Graduate · Florida SouthWestern State College',
}

/** Section ids double as URL hashes (#projects) and nav targets. */
export const sections = [
  { id: 'experience', label: 'Experience', menuLabel: 'Experience' },
  { id: 'projects', label: 'Projects', menuLabel: 'Projects' },
  { id: 'community', label: 'Community', menuLabel: 'Campus & Community' },
  { id: 'education', label: 'Education', menuLabel: 'Education' },
  { id: 'about', label: 'About', menuLabel: 'About' },
  { id: 'contact', label: 'Contact', menuLabel: 'Contact' },
] as const

export type SectionId = (typeof sections)[number]['id']
