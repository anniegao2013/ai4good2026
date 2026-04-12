'use client'

import Link from 'next/link'

const COUNTRY_FLAGS: Record<string, string> = {
  MX: '🇲🇽',
  IN: '🇮🇳',
  PH: '🇵🇭',
  NG: '🇳🇬',
  CA: '🇬🇹',
}

const COUNTRY_NAMES: Record<string, string> = {
  MX: 'Mexico',
  IN: 'India',
  PH: 'Philippines',
  NG: 'Nigeria',
  CA: 'Central America',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-amber-400">Faro</span>
          <span className="text-slate-500 text-sm hidden sm:block">/ financial literacy for immigrants</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        <SkylineSVG />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-4">
            Your financial compass in the US
          </p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
            Your money story,{' '}
            <span className="text-amber-400">translated</span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Faro maps the financial tools you already know — CIBIL scores, tandas,
            UPI, paluwagan — to their US equivalents, so you can hit the ground running.
          </p>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-lg px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-amber-400/20"
          >
            Get your financial map
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
          <p className="text-slate-500 text-sm mt-4">Free. No account required. Takes 2 minutes.</p>
        </div>
      </section>

      {/* Supported countries */}
      <section className="px-6 py-12 border-t border-slate-800">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400 text-sm text-center mb-6 uppercase tracking-widest">
            Supporting immigrants from
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(COUNTRY_FLAGS).map(([code, flag]) => (
              <div
                key={code}
                className="flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2 text-sm"
              >
                <span className="text-xl">{flag}</span>
                <span className="text-slate-200">{COUNTRY_NAMES[code]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How Faro works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <Step
              number="1"
              title="Tell us where you're from"
              description="Select your home country and the financial tools you've used."
            />
            <Step
              number="2"
              title="We translate your toolkit"
              description="Faro maps each tool to its closest US equivalent using a verified knowledge graph."
            />
            <Step
              number="3"
              title="Get your action plan"
              description="A personalized roadmap tells you what to do in your first week, month, and year."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-800 text-center text-slate-600 text-sm">
        Faro — built for AI for Good 2026. Not financial advice.
      </footer>
    </main>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-bold text-lg flex items-center justify-center shrink-0">
        {number}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function SkylineSVG() {
  return (
    <div className="absolute bottom-0 left-0 right-0 opacity-10 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1200 300"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="xMidYMax meet"
      >
        <g fill="#f59e0b">
          <rect x="0" y="200" width="60" height="100" />
          <rect x="50" y="150" width="40" height="150" />
          <rect x="80" y="180" width="30" height="120" />
          <rect x="100" y="120" width="50" height="180" />
          <rect x="140" y="160" width="25" height="140" />
          <rect x="155" y="100" width="60" height="200" />
          <rect x="205" y="140" width="35" height="160" />
          <rect x="230" y="80" width="45" height="220" />
          <rect x="265" y="130" width="30" height="170" />
          <rect x="285" y="170" width="25" height="130" />
          <rect x="300" y="110" width="55" height="190" />
          <rect x="345" y="150" width="30" height="150" />
          <rect x="365" y="90" width="50" height="210" />
          <rect x="405" y="130" width="40" height="170" />
          <rect x="435" y="160" width="25" height="140" />
          <rect x="450" y="60" width="70" height="240" />
          <rect x="510" y="100" width="45" height="200" />
          <rect x="545" y="140" width="30" height="160" />
          <rect x="565" y="80" width="55" height="220" />
          <rect x="610" y="120" width="40" height="180" />
          <rect x="640" y="160" width="25" height="140" />
          <rect x="655" y="100" width="50" height="200" />
          <rect x="695" y="130" width="35" height="170" />
          <rect x="720" y="70" width="60" height="230" />
          <rect x="770" y="110" width="40" height="190" />
          <rect x="800" y="150" width="30" height="150" />
          <rect x="820" y="90" width="55" height="210" />
          <rect x="865" y="130" width="35" height="170" />
          <rect x="890" y="60" width="65" height="240" />
          <rect x="945" y="100" width="40" height="200" />
          <rect x="975" y="140" width="30" height="160" />
          <rect x="995" y="80" width="50" height="220" />
          <rect x="1035" y="120" width="40" height="180" />
          <rect x="1065" y="160" width="25" height="140" />
          <rect x="1080" y="100" width="55" height="200" />
          <rect x="1125" y="130" width="35" height="170" />
          <rect x="1150" y="180" width="50" height="120" />
        </g>
      </svg>
    </div>
  )
}
