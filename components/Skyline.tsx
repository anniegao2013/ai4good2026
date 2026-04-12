'use client'

interface SkylineProps {
  /** Landing page = true (more visible). Other pages = false (very subtle). */
  prominent?: boolean
}

/**
 * Fixed SVG skyline pinned to the bottom of every page.
 * Spec: fill #E1F5EE at 40% opacity, subtle vertical gradient, no stroke.
 */
export function Skyline({ prominent = false }: SkylineProps) {
  const id = prominent ? 'skyline-grad-p' : 'skyline-grad-s'
  const containerOpacity = prominent ? 1 : 0.45

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
        opacity: containerOpacity,
      }}
    >
      <svg
        viewBox="0 0 1440 140"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMax meet"
        style={{ display: 'block', width: '100%' }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E1F5EE" stopOpacity="0" />
            <stop offset="100%" stopColor="#E1F5EE" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Gradient wash over everything */}
        <rect x="0" y="0" width="1440" height="140" fill={`url(#${id})`} />

        {/* Skyline silhouette — fill #E1F5EE at 40% opacity */}
        <g fill="#E1F5EE" fillOpacity="0.40">
          {/* Far left cluster */}
          <rect x="0"   y="105" width="55"  height="35" />
          <rect x="50"  y="80"  width="30"  height="60" />
          {/* antenna */}
          <rect x="63"  y="70"  width="4"   height="10" />

          <rect x="80"  y="95"  width="70"  height="45" />
          <rect x="140" y="60"  width="35"  height="80" />
          {/* stepped top */}
          <rect x="143" y="50"  width="29"  height="12" />
          <rect x="148" y="42"  width="19"  height="10" />

          <rect x="175" y="88"  width="50"  height="52" />
          <rect x="215" y="72"  width="25"  height="68" />

          {/* Mid-left cluster */}
          <rect x="240" y="55"  width="60"  height="85" />
          {/* stepped */}
          <rect x="244" y="45"  width="52"  height="12" />
          <rect x="250" y="38"  width="40"  height="8"  />

          <rect x="300" y="80"  width="38"  height="60" />
          <rect x="330" y="65"  width="25"  height="75" />
          {/* spire */}
          <polygon points="340,55 343,65 337,65" />

          <rect x="355" y="90"  width="55"  height="50" />
          <rect x="400" y="70"  width="40"  height="70" />
          <rect x="430" y="50"  width="30"  height="90" />
          {/* antenna */}
          <rect x="443" y="40"  width="4"   height="12" />

          {/* Center cluster — tallest buildings */}
          <rect x="460" y="85"  width="50"  height="55" />
          <rect x="505" y="45"  width="50"  height="95" />
          {/* stepped top */}
          <rect x="508" y="35"  width="44"  height="12" />
          <rect x="514" y="26"  width="32"  height="10" />
          {/* antenna */}
          <rect x="528" y="15"  width="4"   height="12" />

          <rect x="555" y="68"  width="35"  height="72" />
          <rect x="585" y="40"  width="55"  height="100" />
          {/* stepped */}
          <rect x="588" y="30"  width="49"  height="12" />
          <rect x="595" y="22"  width="35"  height="9" />

          <rect x="640" y="75"  width="30"  height="65" />
          <rect x="665" y="55"  width="45"  height="85" />
          {/* spire */}
          <polygon points="687,44 690,55 684,55" />

          {/* Mid-right cluster */}
          <rect x="710" y="82"  width="55"  height="58" />
          <rect x="758" y="60"  width="38"  height="80" />
          <rect x="790" y="45"  width="50"  height="95" />
          {/* stepped */}
          <rect x="793" y="35"  width="44"  height="12" />
          <rect x="800" y="28"  width="30"  height="8"  />

          <rect x="840" y="75"  width="28"  height="65" />
          <rect x="862" y="55"  width="42"  height="85" />
          {/* antenna */}
          <rect x="880" y="44"  width="4"   height="12" />

          <rect x="904" y="88"  width="55"  height="52" />
          <rect x="950" y="65"  width="32"  height="75" />
          <rect x="975" y="78"  width="50"  height="62" />

          {/* Right cluster */}
          <rect x="1020" y="55" width="45"  height="85" />
          {/* stepped */}
          <rect x="1023" y="44" width="39"  height="12" />
          <rect x="1029" y="36" width="27"  height="10" />

          <rect x="1065" y="82" width="35"  height="58" />
          <rect x="1092" y="65" width="28"  height="75" />
          <rect x="1113" y="48" width="50"  height="92" />
          {/* antenna */}
          <rect x="1136" y="37" width="4"   height="12" />

          <rect x="1163" y="80" width="55"  height="60" />
          <rect x="1210" y="60" width="38"  height="80" />
          <rect x="1242" y="70" width="30"  height="70" />
          {/* spire */}
          <polygon points="1258,58 1261,70 1255,70" />

          <rect x="1272" y="85" width="50"  height="55" />
          <rect x="1315" y="68" width="35"  height="72" />
          <rect x="1344" y="78" width="50"  height="62" />
          <rect x="1390" y="90" width="50"  height="50" />
        </g>
      </svg>
    </div>
  )
}
