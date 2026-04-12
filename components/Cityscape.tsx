'use client'

import { motion } from 'framer-motion'

interface CityscapeProps {
  /** 0 to 1, controls how many building groups are visible and how tall they are. */
  progress?: number
}

/**
 * Animated SVG cityscape that grows with user progress.
 * Uses the Faro brand colour palette.
 */
export function Cityscape({ progress = 0.1 }: CityscapeProps) {
  const groups = Math.max(1, Math.ceil(progress * 5))
  const h = 0.4 + progress * 0.6 // height multiplier

  // Faro brand colours
  const C1 = '#1D9E75' // faro-primary
  const C2 = '#3db58a' // mid
  const C3 = '#7dcfb0' // light
  const C4 = '#085041' // faro-dark

  return (
    <div className="fixed bottom-0 left-0 right-0 h-56 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 w-full h-full"
        preserveAspectRatio="xMidYMax slice"
      >
        {/* Group 1 — always visible */}
        <motion.g
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Tall building with antenna */}
          <rect x="100" y={220 - 140 * h} width="32" height={140 * h} rx="2" fill={C1} fillOpacity="0.30" />
          <rect x="108" y={220 - 140 * h - 20} width="16" height="20" fill={C1} fillOpacity="0.40" />
          <rect x="114" y={220 - 140 * h - 35} width="4" height="15" fill={C1} fillOpacity="0.50" />
          <rect x="106" y={220 - 120 * h} width="8" height="10" rx="1" fill={C4} fillOpacity="0.15" />
          <rect x="118" y={220 - 120 * h} width="8" height="10" rx="1" fill={C4} fillOpacity="0.15" />
          <rect x="106" y={220 - 100 * h} width="8" height="10" rx="1" fill={C4} fillOpacity="0.15" />
          <rect x="118" y={220 - 100 * h} width="8" height="10" rx="1" fill={C4} fillOpacity="0.15" />
          {/* Medium building */}
          <rect x="145" y={220 - 100 * h} width="28" height={100 * h} rx="2" fill={C2} fillOpacity="0.40" />
          <rect x="150" y={220 - 90 * h} width="6" height="8" rx="1" fill={C1} fillOpacity="0.20" />
          <rect x="162" y={220 - 90 * h} width="6" height="8" rx="1" fill={C1} fillOpacity="0.20" />
          {/* Small building */}
          <rect x="185" y={220 - 70 * h} width="22" height={70 * h} rx="2" fill={C3} fillOpacity="0.50" />
        </motion.g>

        {/* Group 2 */}
        {groups >= 2 && (
          <motion.g
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            <rect x="300" y={220 - 110 * h} width="35" height={110 * h} rx="2" fill={C1} fillOpacity="0.35" />
            <rect x="306" y={220 - 110 * h - 12} width="23" height="12" rx="2" fill={C1} fillOpacity="0.45" />
            <rect x="350" y={220 - 80 * h} width="26" height={80 * h} rx="2" fill={C2} fillOpacity="0.40" />
            <rect x="390" y={220 - 60 * h} width="20" height={60 * h} rx="2" fill={C3} fillOpacity="0.50" />
          </motion.g>
        )}

        {/* Group 3 — center (main focal point) */}
        {groups >= 3 && (
          <motion.g
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {/* Tall tower */}
            <rect x="550" y={220 - 160 * h} width="40" height={160 * h} rx="3" fill={C4} fillOpacity="0.35" />
            <rect x="560" y={220 - 160 * h - 25} width="20" height="25" rx="2" fill={C4} fillOpacity="0.45" />
            <rect x="568" y={220 - 160 * h - 40} width="4" height="15" fill={C4} fillOpacity="0.55" />
            {/* Windows */}
            {[0, 1, 2, 3, 4].map((row) => (
              <g key={row}>
                <rect x="556" y={220 - (150 - row * 25) * h} width="8" height="12" rx="1" fill={C3} fillOpacity="0.25" />
                <rect x="568" y={220 - (150 - row * 25) * h} width="8" height="12" rx="1" fill={C3} fillOpacity="0.25" />
                <rect x="580" y={220 - (150 - row * 25) * h} width="8" height="12" rx="1" fill={C3} fillOpacity="0.25" />
              </g>
            ))}
            <rect x="605" y={220 - 120 * h} width="32" height={120 * h} rx="2" fill={C1} fillOpacity="0.35" />
            <rect x="650" y={220 - 90 * h} width="28" height={90 * h} rx="2" fill={C2} fillOpacity="0.45" />
            <rect x="692" y={220 - 70 * h} width="24" height={70 * h} rx="2" fill={C3} fillOpacity="0.50" />
          </motion.g>
        )}

        {/* Group 4 */}
        {groups >= 4 && (
          <motion.g
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <rect x="850" y={220 - 130 * h} width="36" height={130 * h} rx="2" fill={C1} fillOpacity="0.35" />
            <rect x="858" y={220 - 130 * h - 15} width="20" height="15" rx="2" fill={C1} fillOpacity="0.45" />
            <rect x="900" y={220 - 100 * h} width="30" height={100 * h} rx="2" fill={C2} fillOpacity="0.40" />
            <rect x="945" y={220 - 75 * h} width="25" height={75 * h} rx="2" fill={C3} fillOpacity="0.50" />
            <rect x="985" y={220 - 55 * h} width="20" height={55 * h} rx="2" fill={C3} fillOpacity="0.55" />
          </motion.g>
        )}

        {/* Group 5 — right side */}
        {groups >= 5 && (
          <motion.g
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <rect x="1100" y={220 - 120 * h} width="34" height={120 * h} rx="2" fill={C1} fillOpacity="0.30" />
            <rect x="1108" y={220 - 120 * h - 18} width="18" height="18" rx="2" fill={C1} fillOpacity="0.40" />
            <rect x="1150" y={220 - 95 * h} width="28" height={95 * h} rx="2" fill={C2} fillOpacity="0.40" />
            <rect x="1195" y={220 - 70 * h} width="24" height={70 * h} rx="2" fill={C3} fillOpacity="0.50" />
            <rect x="1235" y={220 - 50 * h} width="20" height={50 * h} rx="2" fill={C3} fillOpacity="0.55" />
            <rect x="1320" y={220 - 85 * h} width="30" height={85 * h} rx="2" fill={C2} fillOpacity="0.35" />
            <rect x="1365" y={220 - 60 * h} width="25" height={60 * h} rx="2" fill={C3} fillOpacity="0.45" />
          </motion.g>
        )}

        {/* Celebration sparkles at 100% */}
        {progress >= 1 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.circle
              cx="580" cy="30" r="4" fill="#fbbf24"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx="620" cy="50" r="3" fill="#fb923c"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.circle
              cx="560" cy="55" r="3" fill={C1}
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
            />
          </motion.g>
        )}
      </svg>
    </div>
  )
}
