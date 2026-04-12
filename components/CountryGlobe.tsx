'use client'

import Globe from 'react-globe.gl'
import type { OnboardingCountry } from '@/lib/types'

type CountryPoint = {
  code: OnboardingCountry
  lat: number
  lng: number
  label: string
}

const COUNTRY_POINTS: CountryPoint[] = [
  { code: 'MX', lat: 23,   lng: -102,  label: 'Mexico'       },
  { code: 'IN', lat: 20,   lng: 78,    label: 'India'        },
  { code: 'PH', lat: 13,   lng: 122,   label: 'Philippines'  },
  { code: 'NG', lat: 9,    lng: 8,     label: 'Nigeria'      },
  { code: 'GT', lat: 15.7, lng: -90.2, label: 'Guatemala'    },
  { code: 'SV', lat: 13.7, lng: -89.2, label: 'El Salvador'  },
  { code: 'HN', lat: 15.2, lng: -86.2, label: 'Honduras'     },
]

export function CountryGlobe({
  onSelect,
  selectedCode,
}: {
  onSelect: (code: OnboardingCountry) => void
  selectedCode?: OnboardingCountry | null
}) {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '320px', height: '320px' }}>
        <Globe
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(255,255,255,1)"
          pointsData={COUNTRY_POINTS}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={(d) => {
            const p = d as CountryPoint
            return p.code === selectedCode ? 0.08 : 0.02
          }}
          pointRadius={(d) => {
            const p = d as CountryPoint
            return p.code === selectedCode ? 1.0 : 0.6
          }}
          pointColor={(d) => {
            const p = d as CountryPoint
            return p.code === selectedCode ? '#a78bfa' : '#f97316'
          }}
          pointLabel="label"
          onPointClick={(point) => {
            const p = point as CountryPoint
            onSelect(p.code)
          }}
          width={320}
          height={320}
        />
      </div>
    </div>
  )
}