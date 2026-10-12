export type Stat = {
  label: string
  /** Numeric stats count up from 0; `text` stats are shown as-is. */
  value?: number
  decimals?: number
  prefix?: string
  suffix?: string
  text?: string
}

export type Experience = {
  role: string
  org: string
  dates: string
  desc: string
}

export type Cover = {
  /** Cover background */
  color: string
  /** Text color on the cover */
  ink: string
  /** Decorative ring: size and offset inside the cover */
  ring: number
  rx: number
  ry: number
  /** Color of the blurred glow behind the cover-flow when this card is centered */
  glow: string
}

export type Project = {
  slug: string
  title: string
  kicker: string
  period: string
  summary: string
  highlights: string[]
  role: string
  tech: string[]
  /** Shown in the detail sheet; omit when there's no public link. */
  link?: string
  award?: string
  status?: string
  cover: Cover
  /** Optional screenshot in /public/images/projects */
  image?: string
}

export type CommunityItem = {
  name: string
  role: string
  desc: string
  photoLabel: string
  color: string
  /** Optional event photo in /public/community */
  image?: string
}
