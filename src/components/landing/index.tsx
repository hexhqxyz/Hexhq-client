import React from "react";
import dynamic from "next/dynamic";

const DynamicSpotlightPreview = dynamic(
  () => import("./Spotlight").then((mod) => mod.SpotlightPreview),
  {
    loading: () => <p>Loading Spotlight...</p>,
  }
);

const DynamicHeroScrollDemo = dynamic(
  () => import("./MainContainer").then((mod) => mod.HeroScrollDemo),
  {
    loading: () => <p>Loading Hero Scroll...</p>,
  }
);

const DynamicParallaxScrollDemo = dynamic(
  () => import("./ParallelScrollMain").then((mod) => mod.ParallaxScrollDemo),
  {
    loading: () => <p>Loading Parallax Scroll...</p>,
  }
);

const DynamicAppleCardsCarouselDemo = dynamic(
  () => import("./CardsCarousel").then((mod) => mod.AppleCardsCarouselDemo),
  {
    loading: () => <p>Loading Cards Carousel...</p>,
  }
);

const DynamicVortexDemo = dynamic(
  () => import("./VotexMain").then((mod) => mod.VortexDemo),
  {
    loading: () => <p>Loading Vortex...</p>,
  }
);

const DynamicProudlyUsed = dynamic(
  () => import("./ProudlyUsed").then((mod) => mod.ProudlyUsed),
  {
    loading: () => <p>Loading Proudly Used...</p>,
  }
);

type Props = {};

const LandingMain = (props: Props) => {
  return (
    <div className="w-full">
      <DynamicSpotlightPreview />
      <DynamicProudlyUsed />
      <DynamicHeroScrollDemo />
      <DynamicAppleCardsCarouselDemo />
      <DynamicVortexDemo />
      <DynamicParallaxScrollDemo />
    </div>
  );
};

export default LandingMain;
