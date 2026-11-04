import { AccentDriver } from './components/layout/Background'
import { Nav } from './components/layout/Nav'
import { About } from './components/sections/About'
import { Community } from './components/sections/Community'
import { Contact } from './components/sections/Contact'
import { Education } from './components/sections/Education'
import { Experience } from './components/sections/Experience'
import { Hero } from './components/sections/Hero'
import { Projects } from './components/sections/Projects'
import { Stats } from './components/sections/Stats'
import { site } from './content/site'

const YEAR = new Date().getFullYear()

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <a
        href="#experience"
        className="sr-only z-50 rounded-full bg-bone px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <AccentDriver />

      <main className="relative z-[1]">
        <Hero />
        <Stats />
        <Experience />
        <Projects />
        <Community />
        <Education />
        <About />
        <Contact />
      </main>

      <footer className="container-page relative z-[1] flex items-center justify-between gap-4 pb-[130px] text-[13px] text-muted-2 md:pb-12">
        <span>
          © {YEAR} {site.fullName}
        </span>
        <a
          href="#top"
          data-umami-event="back-to-top"
          className="press inline-flex min-h-[44px] items-center gap-2 rounded-full border border-hairline bg-fill-soft px-4 font-semibold text-text"
        >
          Back to top <span aria-hidden="true" className="text-accent">↑</span>
        </a>
      </footer>

      <Nav />
    </div>
  )
}
