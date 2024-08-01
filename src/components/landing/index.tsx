import React from 'react'
import { SpotlightPreview } from './Spotlight'
import { HeroScrollDemo } from './MainContainer'

type Props = {}

const LandingMain = (props: Props) => {
  return (
    <div className='w-full'>
        <SpotlightPreview />
        <HeroScrollDemo />
    </div>
  )
}

export default LandingMain