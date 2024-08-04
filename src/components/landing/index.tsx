import React from 'react'
import { SpotlightPreview } from './Spotlight'
import { HeroScrollDemo } from './MainContainer'
import { ParallaxScrollDemo } from './ParallelScrollMain'
import { AppleCardsCarouselDemo } from './CardsCarousel'
import { VortexDemo } from './VotexMain'

type Props = {}

const LandingMain = (props: Props) => {
  return (
    <div className='w-full'>
        <SpotlightPreview />
        <HeroScrollDemo />
        <AppleCardsCarouselDemo />
        <VortexDemo />
        <ParallaxScrollDemo />
    </div>
  )
}

export default LandingMain