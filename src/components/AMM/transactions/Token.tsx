import Image from "next/image";
import { STAKING_TOKEN_CONTRACT_ADDRESS, REWARD_TOKEN_ADDRESS, BLOCK_EXPLORER } from "@/lib/constants";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Token = ({ address }: {address:string}) => {
  const normalizedAddress = address.toLowerCase();

  const getTokenImage = () => {
    const SIZE = 18;
    switch (normalizedAddress) {
      case STAKING_TOKEN_CONTRACT_ADDRESS.toLowerCase():
        return (
          <Image width={SIZE} height={SIZE} src="/atx-token.svg" alt="ATX Token" />
        );
      case REWARD_TOKEN_ADDRESS.toLowerCase():
        return (
          <Image width={SIZE} height={SIZE} src="/dusd-token.svg" alt="dUSD Token" />
        );
      default:
        return <span>Unknown</span>;
    }
  };

  const getTokenName = () => {
    switch (normalizedAddress) {
      case STAKING_TOKEN_CONTRACT_ADDRESS.toLowerCase():
        return "ATX";
      case REWARD_TOKEN_ADDRESS.toLowerCase():
        return "dUSD";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="flex items-center gap-x-1 text-primary">
      {getTokenImage()} {getTokenName()}
    </div>
  );
};

export const LinkToken = ({ address }: { address: string }) => {
  return (
    <Link
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "p-1")}
      href={`${BLOCK_EXPLORER}/token/${address}`}
      target="_blank"
    >
      <Token address={address} />
    </Link>
  );
};

export default Token;
