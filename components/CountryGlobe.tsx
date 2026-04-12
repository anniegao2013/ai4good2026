'use client'

import Globe from 'react-globe.gl'
import { useRef } from 'react'
import type { OnboardingCountry } from '@/lib/types'

const COUNTRY_POINTS: { code: OnboardingCountry; lat: number; lng: number }[] = [
  { code: 'MX', lat: 23, lng: -102 },
  { code: 'IN', lat: 20, lng: 78 },
  { code: 'PH', lat: 13, lng: 122 },
  { code: 'NG', lat: 9, lng: 8 },
  { code: 'GT', lat: 15.7, lng: -90.2 },
  { code: 'SV', lat: 13.7, lng: -89.2 },
  { code: 'HN', lat: 15.2, lng: -86.2 },
]

export function CountryGlobe({
  onSelect,
}: {
  onSelect: (code: OnboardingCountry) => void
}) {
  const globeRef = useRef<any>()

  return (
    <div className="w-full flex justify-center">
      <div className="w-[320px] sm:w-[360px] h-[320px]">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={COUNTRY_POINTS}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.02}
        pointRadius={0.6}
        onPointClick={(p: any) => onSelect(p.code)}
      />
      </div>
    </div>
  )
}