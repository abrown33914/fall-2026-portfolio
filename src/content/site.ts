import type { Stat } from '../lib/types'

export const site = {
  firstName: 'Allison',
  lastName: 'Brown',
  fullName: 'Allison Brown',
  lead: 'Software engineering student with experience in fullstack development, technical leadership, and collaborative projects.',
  badge: 'SOFTWARE ENGINEERING · CLASS OF 2027 ·',
  email: 'abrown33914@gmail.com',
  linkedin: { label: 'linkedin.com/in/abrown27', href: 'https://www.linkedin.com/in/abrown27' },
  github: { label: 'github.com/abrown33914', href: 'https://github.com/abrown33914' },
  /** Drop your one-page résumé at public/AllisonBrown_Resume.pdf */
  resume: '/AllisonBrown.pdf',
  /** Hero portrait in /public/images; leave undefined to show the styled placeholder. */
  portrait: '/images/allison.jpg',
} as const

/**
 * Logos that drift behind the hero at ~7% opacity (decorative, single-tone).
 * Files are trimmed copies in /public/logos/trim; w/h are their pixel size (sets the aspect ratio).
 * `height` scales with the viewport; `mobile: false` hides the logo below 768px (the mobile layout); `mx`/`my`/`mh` override x/y/height there.
 */
export const floaters = [
  { t: 'HSI', src: '/logos/trim/dhs.png', w: 362, h: 360, height: 'clamp(56px,7vw,96px)', x: '2%', y: '3%', rot: -8, p: 0, mobile: true, mh: '48px', mx: '3%', my: '15%' },
  { t: 'EagleHacks', src: '/logos/trim/eaglehacks.png', w: 220, h: 360, height: 'clamp(32px,3vw,44px)', x: '90%', y: '40%', rot: 6, p: 1.4, mobile: false },
  { t: 'Boombox', src: '/logos/trim/boombox.png', w: 1000, h: 191, height: 'clamp(28px,3.6vw,52px)', x: '24%', y: '92%', rot: -5, p: 2.6, mobile: false },
  { t: 'INIT', src: '/logos/trim/init.png', w: 974, h: 360, height: 'clamp(32px,4vw,56px)', x: '44%', y: '70%', rot: 9, p: 3.3, mobile: true, mh: '30px', mx: '70%', my: '62%' },
  { t: 'CSSEC', src: '/logos/trim/cssec.png', w: 420, h: 360, height: 'clamp(40px,3.4vw,48px)', x: '50%', y: '84%', rot: -10, p: 4.1, mobile: true, mh: '40px', mx: '82%', my: '88%' },
  { t: 'Whitaker', src: '/logos/trim/fgcu.png', w: 1000, h: 120, height: 'clamp(28px,3.3vw,48px)', x: '60%', y: '11.5%', rot: 4, p: 5.2, mobile: true, mh: '16px', mx: '24%', my: '4%' },
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
    { label: 'Photo of you', color: '#4B1E23', image: '/images/headshot.jpg' },
    { label: 'Candid', color: '#6B6F4E', image: '/images/candid.jpg' },
    { label: 'Tabling', color: '#2E3A4B', image: '/images/tabling.jpg' },
  ],
}

export const education = {
  degree: 'B.S. Software Engineering',
  school: 'Florida Gulf Coast University',
  detail: 'Minor in Marketing · Whitaker College of Engineering · Expected May 2027',
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
