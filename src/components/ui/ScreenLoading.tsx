import Image from "next/image";
import React from "react";

const ScreenLoading = () => {
  return (
    <div className="flex items-center justify-center md:mt-40 mt-20">
      <div className="text-center flex items-center flex-col">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
          <Image
            src="/avatar_thinking.svg"
            className="rounded-full"
            width={100}
            height={100}
            alt="loading"
          />
          {/* <Beaker className="rounded-full h-20 w-20 text-primary" /> */}
        </div>

        <p className="text-lg font-medium mt-8 text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default ScreenLoading;
