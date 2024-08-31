import React from "react";
import dynamic from "next/dynamic";

const DynamicSpotlightPreview = dynamic(
  () => import("./Spotlight").then((mod) => mod.SpotlightPreview),
  {
    loading: () => <p>Loading...</p>,
  }
);

const DynamicHeroScrollDemo = dynamic(
  () => import("./MainContainer").then((mod) => mod.HeroScrollDemo),
  {
    loading: () => <p>Loading...</p>,
  }
);

const DynamicParallaxScrollDemo = dynamic(
  () => import("./ParallelScrollMain").then((mod) => mod.ParallaxScrollDemo),
  {
    loading: () => <p>Loading...</p>,
  }
);

const DynamicAppleCardsCarouselDemo = dynamic(
  () => import("./CardsCarousel").then((mod) => mod.AppleCardsCarouselDemo),
  {
    loading: () => <p>Loading...</p>,
  }
);

const DynamicVortexDemo = dynamic(
  () => import("./VotexMain").then((mod) => mod.VortexDemo),
  {
    loading: () => <p>Loading...</p>,
  }
);

type Props = {};

const LandingMain = (props: Props) => {
  return (
    <div className="w-full">
        <DynamicSpotlightPreview />
      <DynamicHeroScrollDemo />
      <DynamicAppleCardsCarouselDemo />
      <DynamicVortexDemo />
      <DynamicParallaxScrollDemo />
    </div>
  );
};

export default LandingMain;
