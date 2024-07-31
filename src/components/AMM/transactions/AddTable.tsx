import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import {
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { GET_SWAP_DATA } from "@/lib/services/graphql/queries";
import { cn, formatNumber, shortenString } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { ethers } from "ethers";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Token, { LinkToken } from "./Token";
import ReuseTable from "./ReuseTable";

export default function AddTable() {
  const { loading, error, data } = useQuery(GET_SWAP_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const labels = [
    {
      name: "Wallet",
    },

    {
      name: "Type",
    },
    {
      name: "Amount In",
    },
    {
      name: "Amount out",
    },
    {
      name: "Tx Hash",
    },
    {
      name: (
        <div className="flex items-center justify-end gap-x-2">
          <ArrowDown className="w-4 h-4 text-muted-foreground" />
          Time
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <ReuseTable labels={labels}>
      {data.swappeds.map((swap: any) => (
        <TableRow key={swap.transactionHash} className="">
          <TableCell className="py-5">{shortenString(swap.swapper)}</TableCell>

          <TableCell>
            <div className="flex items-center gap-x-2 text-muted-foreground">
              Swap
              <LinkToken address={swap.tokenIn} />
              For <LinkToken address={swap.tokenOut} />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-x-2 text-base">
              {formatNumber(ethers.formatUnits(swap.amountIn))}{" "}
              <LinkToken address={swap.tokenIn} />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-x-1">
              <div className="flex items-center gap-x-2 text-base">
                {formatNumber(ethers.formatUnits(swap.amountOut))}{" "}
                <LinkToken address={swap.tokenOut} />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <Link
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-muted-foreground p-0 m-0"
              )}
              target="_blank"
              href={`https://www.sepolia.etherscan.io/tx/${swap.transactionHash}`}
            >
              {shortenString(swap.transactionHash)}
            </Link>
          </TableCell>
          <TableCell className="font-medium text-right">
            <Link
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "text-muted-foreground p-0 m-0"
              )}
              target="_blank"
              href={`https://www.sepolia.etherscan.io/tx/${swap.transactionHash}`}
            >
              {moment(new Date(swap.blockTimestamp * 1000)).fromNow()}
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </ReuseTable>
  );
}
