import type { Project } from '../lib/types'

/**
 * All copy is drawn from the master résumé. Order = cover-flow order.
 * Add a screenshot by dropping it in public/images/projects/ and setting `image`.
 */
export const projects: Project[] = [
  {
    slug: 'hashwebcrawler',
    title: 'HashWebCrawler',
    kicker: 'Digital forensics',
    period: '2026 – present',
    status: 'Prototype · in progress',
    summary:
      'A Python and Playwright crawler that discovers media on web sources and generates SHA-1/MD5 hashes for reproducible investigative reporting. It started as a prototype for an evidence-review bottleneck I saw during my HSI internship.',
    highlights: [
      'FastAPI backend with an HTML/JS interface, isolated per-crawl hash sessions, and export',
      'REST API deduplication lookups to cut redundant evidence review',
      'Structured hash output across hundreds of media files',
    ],
    role: 'Creator & developer',
    tech: ['Python', 'FastAPI', 'Playwright', 'SHA-1 / MD5', 'HTML/JS'],
    link: 'https://github.com/abrown33914/HashWebCrawler',
    cover: { color: '#4B1E23', ink: '#E6E0D6', ring: 170, rx: 60, ry: -40, glow: '#7A2A36' },
  },
  {
    slug: 'imposture',
    title: 'iMPOSTURE',
    kicker: 'Computer vision',
    period: 'Sep 2025',
    award: 'Winner, Google Cloud ADK Challenge · Top 11 overall · ShellHacks 2025',
    summary:
      'A real-time AI posture coach built by a four-person team in 24 hours at ShellHacks 2025, competing among 1,400+ hackers. It uses computer vision to detect posture and phone use, with AI agents watching posture, distractions, and noise.',
    highlights: [
      'MediaPipe + YOLOv11 pipeline for posture and phone detection',
      '3 Google ADK agents streaming 38K+ rows to Google Cloud Logging',
      'Responsive wellness UI with real-time, adaptive feedback',
    ],
    role: 'Developer · 4-person hackathon team',
    tech: ['Python', 'MediaPipe', 'YOLOv11', 'Google ADK', 'Cloud Logging'],
    link: 'https://github.com/abrown33914/iMPOSTURE',
    cover: { color: '#B4C3F2', ink: '#121212', ring: 210, rx: -60, ry: 20, glow: '#5D6FB0' },
  },
  {
    slug: 'traffic-pavement',
    title: 'Traffic & Pavement Intelligence',
    kicker: 'Cloud backend',
    period: 'Aug – Dec 2025',
    summary:
      'An event-driven Azure backend that ingests live FDOT sensor data into digital-twin road-segment models and forecasts pavement and traffic conditions for predictive maintenance.',
    highlights: [
      '7 Azure Functions automating ingestion, processing, and twin updates',
      'ML forecasts exposed through REST APIs for downstream reporting',
      'Delivered end to end, from pipeline design through deployment',
    ],
    role: 'Backend & ML developer',
    tech: ['Python', 'Azure Functions', 'Azure Storage', 'Machine learning', 'Digital Twin'],
    link: 'https://github.com/abrown33914/lucian-backend',
    cover: { color: '#6B6F4E', ink: '#F3EFE7', ring: 140, rx: 100, ry: 40, glow: '#6B6F4E' },
  },
  {
    slug: 'drone-security',
    title: 'Drone Security Simulations',
    kicker: 'Security research',
    period: 'Feb – Apr 2025',
    summary:
      'Simulated RF jamming attacks on delivery drones across three adversarial scenarios to find where UAV communications break, then built and validated defenses in simulation.',
    highlights: [
      'Frequency-hopping defense that rotates channels every few seconds to evade jamming',
      'MAVLink heartbeat monitor with a 5-second failsafe that lands on signal loss',
      'Technical report on attack vectors, countermeasures, and resilience',
    ],
    role: 'Developer & report author',
    tech: ['Python', 'ArduPilot SITL', 'MAVLink', 'MAVProxy', 'Gazebo'],
    link: 'https://github.com/abrown33914/drone-project-simulations',
    cover: { color: '#1C2430', ink: '#E6E0D6', ring: 230, rx: 20, ry: -90, glow: '#2F4266' },
  },
  {
    slug: 'disaster-assistance-tests',
    title: 'DisasterAssistance.gov Test Suite',
    kicker: 'Test automation',
    period: 'Mar 2026',
    summary:
      'A Selenium and TestNG suite of 40 tests validating key user flows on the live U.S. government disaster-assistance site.',
    highlights: [
      'Authored 4 of 8 test classes: homepage, navigation, search, and FAQ',
      'Object-oriented architecture with BaseTest inheritance and testng.xml sequencing',
      'Checks forms, sign-in redirects, and federal banner compliance with XML reports',
    ],
    role: 'Test engineer · team project',
    tech: ['Java', 'Selenium WebDriver', 'TestNG', 'Maven'],
    link: 'https://github.com/abrown33914/disaster-assistance-automated-testing',
    cover: { color: '#E6E0D6', ink: '#121212', ring: 160, rx: -30, ry: -30, glow: '#8F887C' },
  },
  {
    slug: 'wealthwise',
    title: 'WealthWise AI',
    kicker: 'Mobile · FinTech',
    period: 'Sep 2024',
    award: 'Top 20 of 250+ projects · ShellHacks 2024',
    summary:
      'A personal finance app with an OpenAI-powered advice chatbot and live market data, built by a four-person team in 24 hours.',
    highlights: [
      'Built the React Native frontend with Expo',
      'Interactive budget charts for real-time expense and income tracking',
      'Node.js/Express backend with SQLite3 and Yahoo Finance data',
    ],
    role: 'Frontend developer · 4-person hackathon team',
    tech: ['React Native', 'Expo', 'TypeScript', 'Node.js', 'Express', 'OpenAI API', 'SQLite3'],
    link: 'https://github.com/abrown33914/wealthwise-ai',
    cover: { color: '#4A3B55', ink: '#ECE6F0', ring: 190, rx: 80, ry: -60, glow: '#6A4F7C' },
  },
  {
    slug: 'neo-eden',
    title: 'Neo-Eden',
    kicker: 'Full-stack · AI',
    period: 'May 2025',
    summary:
      'A location-based platform for discovering community resources nearby, with real-time status updates and AI image classification.',
    highlights: [
      'Built the frontend, including location tracking and a custom search radius',
      'Integrated Google Gemini to classify uploaded resource images through a dedicated API endpoint',
    ],
    role: 'Frontend developer',
    tech: ['React Native', 'Node.js', 'Express', 'MongoDB', 'Google Gemini'],
    link: 'https://github.com/abrown33914/neo-eden',
    cover: { color: '#3E5550', ink: '#E9EFEC', ring: 150, rx: -20, ry: 60, glow: '#3E6A60' },
  },
  {
    slug: 'linux-dns-web',
    title: 'Linux DNS & Web Server',
    kicker: 'Infrastructure',
    period: 'Aug – Dec 2024',
    summary:
      'A Red Hat Linux environment with a BIND9 DNS server and an Apache web server, configured, networked, and fully documented.',
    highlights: [
      'Forward and reverse lookup zones verified with dig',
      'VirtualBox networking and firewall rules opening ports 53 and 80',
      'Setup and testing procedures documented in a formal report',
    ],
    role: 'Configuration & documentation',
    tech: ['Red Hat Linux', 'BIND9', 'Apache', 'Bash', 'VirtualBox'],
    link: 'https://github.com/abrown33914/linux-dns-webserver-config',
    cover: { color: '#4F5A3A', ink: '#F3EFE7', ring: 220, rx: 40, ry: -70, glow: '#5E6B42' },
  },
  {
    slug: 'obesity-classification',
    title: 'Multiclass Obesity Classification',
    kicker: 'Machine learning',
    period: 'Nov 2025',
    summary:
      'A neural-network study comparing 12 MLP classifiers across depth, width, regularization, and activation for 7-class prediction.',
    highlights: [
      '94% test accuracy with a 5-layer sigmoid model',
      'F1 improved from 0.89 to 0.94 through a structured ablation study',
      'Results presented in a formal technical presentation',
    ],
    role: 'Model training & evaluation',
    tech: ['Python', 'NumPy', 'scikit-learn'],
    cover: { color: '#5A2430', ink: '#F0E6E2', ring: 160, rx: 90, ry: 50, glow: '#7A2A36' },
  },
]
