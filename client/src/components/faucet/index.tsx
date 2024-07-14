"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";

type Props = {};

const Faucet = (props: Props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Button
        className="w-full"
        onClick={() => {}}
        disabled={loading}
        loading={loading}
      >
        Send Me DTX
      </Button>
    </div>
  );
};

export default Faucet;
