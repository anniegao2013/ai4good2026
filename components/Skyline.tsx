'use client'

import { useState, useEffect } from 'react'

interface SkylineProps {
  /** Landing page = true (more visible). Other pages = false (subtle). */
  prominent?: boolean
}

/**
 * Fixed SVG skyline. Buildings use faro-primary (#1D9E75).
 * Base buildings are always shown. 5 earned groups appear
 * progressively as the user completes tasks (via faro:skyline-update event
 * and the faro_buildings localStorage key).
 */
export function Skyline({ prominent = false }: SkylineProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('faro_buildings') ?? '0', 10)
    setCount(isNaN(saved) ? 0 : saved)

    function onUpdate(e: Event) {
      const { count: c } = (e as CustomEvent<{ count: number }>).detail
      setCount(c)
    }
    window.addEventListener('faro:skyline-update', onUpdate)
    return () => window.removeEventListener('faro:skyline-update', onUpdate)
  }, [])

  const baseOpacity  = prominent ? 0.30 : 0.18
  const earnOpacity  = prominent ? 0.55 : 0.40

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 1440 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: 'block', width: '100%' }}
      >
        <defs>
          <linearGradient id="sky-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1D9E75" stopOpacity="0" />
            <stop offset="100%" stopColor="#1D9E75" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="1440" height="180" fill="url(#sky-ground)" />

        {/* ── Base buildings — always visible ───────────────────────────────── */}
        <g style={{ fill: '#1D9E75', fillOpacity: baseOpacity }}>
          {/* Tallest center pair */}
          <rect x="505" y="20"  width="50"  height="160" />
          <rect x="508" y="10"  width="44"  height="12"  />
          <rect x="514" y="2"   width="32"  height="10"  />
          <rect x="528" y="0"   width="4"   height="4"   />

          <rect x="585" y="25"  width="55"  height="155" />
          <rect x="588" y="15"  width="49"  height="12"  />
          <rect x="595" y="7"   width="35"  height="10"  />

          {/* Right-of-center tall */}
          <rect x="790" y="35"  width="50"  height="145" />
          <rect x="793" y="25"  width="44"  height="12"  />
          <rect x="800" y="18"  width="30"  height="9"   />

          {/* Left-of-center tall */}
          <rect x="240" y="42"  width="60"  height="138" />
          <rect x="244" y="32"  width="52"  height="12"  />
          <rect x="250" y="25"  width="40"  height="9"   />

          {/* Right cluster */}
          <rect x="1020" y="42" width="45"  height="138" />
          <rect x="1023" y="32" width="39"  height="12"  />
          <rect x="1029" y="25" width="27"  height="9"   />

          <rect x="1113" y="45" width="50"  height="135" />
          <rect x="1136" y="33" width="4"   height="14"  />

          {/* Supporting medium buildings */}
          <rect x="140"  y="62"  width="35"  height="118" />
          <rect x="143"  y="52"  width="29"  height="12"  />

          <rect x="430"  y="55"  width="30"  height="125" />
          <rect x="443"  y="42"  width="4"   height="15"  />

          <rect x="665"  y="58"  width="45"  height="122" />

          <rect x="862"  y="58"  width="42"  height="122" />
          <rect x="880"  y="46"  width="4"   height="14"  />

          <rect x="1210" y="62"  width="38"  height="118" />
        </g>

        {/* ── Earned group 1 — left fringe ────────────────────────────────── */}
        <g style={{
          fill: '#1D9E75',
          fillOpacity: count >= 1 ? earnOpacity : 0,
          transition: 'fill-opacity 1s ease',
        }}>
          <rect x="0"   y="82"  width="35"  height="98"  />
          <rect x="50"  y="72"  width="30"  height="108" />
          <rect x="63"  y="62"  width="4"   height="12"  />
          <rect x="80"  y="92"  width="70"  height="88"  />
          <rect x="175" y="90"  width="50"  height="90"  />
          <rect x="215" y="73"  width="25"  height="107" />
        </g>

        {/* ── Earned group 2 — mid-left ────────────────────────────────────── */}
        <g style={{
          fill: '#1D9E75',
          fillOpacity: count >= 2 ? earnOpacity : 0,
          transition: 'fill-opacity 1s ease',
        }}>
          <rect x="300" y="80"  width="38"  height="100" />
          <rect x="330" y="65"  width="25"  height="115" />
          <rect x="355" y="91"  width="55"  height="89"  />
          <rect x="400" y="72"  width="40"  height="108" />
          <rect x="460" y="86"  width="50"  height="94"  />
          <rect x="555" y="70"  width="35"  height="110" />
        </g>

        {/* ── Earned group 3 — mid-right ───────────────────────────────────── */}
        <g style={{
          fill: '#1D9E75',
          fillOpacity: count >= 3 ? earnOpacity : 0,
          transition: 'fill-opacity 1s ease',
        }}>
          <rect x="640" y="76"  width="30"  height="104" />
          <rect x="710" y="83"  width="55"  height="97"  />
          <rect x="758" y="61"  width="38"  height="119" />
          <rect x="840" y="76"  width="28"  height="104" />
          <rect x="904" y="90"  width="55"  height="90"  />
          <rect x="950" y="67"  width="32"  height="113" />
          <rect x="975" y="80"  width="50"  height="100" />
        </g>

        {/* ── Earned group 4 — right fringe ────────────────────────────────── */}
        <g style={{
          fill: '#1D9E75',
          fillOpacity: count >= 4 ? earnOpacity : 0,
          transition: 'fill-opacity 1s ease',
        }}>
          <rect x="1065" y="83" width="35"  height="97"  />
          <rect x="1092" y="66" width="28"  height="114" />
          <rect x="1163" y="81" width="55"  height="99"  />
          <rect x="1242" y="71" width="30"  height="109" />
          <rect x="1272" y="86" width="50"  height="94"  />
          <rect x="1315" y="68" width="35"  height="112" />
        </g>

        {/* ── Earned group 5 — far edges, full city ────────────────────────── */}
        <g style={{
          fill: '#1D9E75',
          fillOpacity: count >= 5 ? earnOpacity : 0,
          transition: 'fill-opacity 1s ease',
        }}>
          <rect x="1344" y="78" width="50"  height="102" />
          <rect x="1390" y="91" width="50"  height="89"  />
          {/* spires on landmark buildings light up */}
          <polygon points="340,55 343,67 337,67" />
          <polygon points="687,44 690,57 684,57" />
          <polygon points="1258,56 1261,70 1255,70" />
        </g>
      </svg>
    </div>
  )
}
