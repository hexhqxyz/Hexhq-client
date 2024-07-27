"use client";

import React, { Suspense } from "react";
import ScreenLoading from "@/components/ui/ScreenLoading";
import useInitializeAmm from "@/hooks/use-initialize-amm";

type Props = {
  children: React.ReactNode;
};

const tabItems = [
  {
    title: "Swap",
    href: "/staking",
  },
];

const Layout = ({ children }: Props) => {
  useInitializeAmm();

  return (
    <div>
      <Suspense fallback={<ScreenLoading />}>
        <div className="flex flex-col w-full items-center min-h-[calc(100vh-86px)] justify-center">
          <div className="w-full px-2 py-0.5 flex flex-col items-center">
            {children}
          </div>
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
