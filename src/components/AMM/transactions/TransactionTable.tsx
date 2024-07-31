"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { TableCell, TableRow } from "@/components/ui/table";
import moment from "moment";
import {
  GET_SWAP_DATA,
  GET_ADD_LIQUIDITY_DATA,
  GET_REMOVE_LIQUIDITY_DATA,
} from "@/lib/services/graphql/queries";
import { cn, formatNumber, shortenString } from "@/lib/utils";
import { ethers } from "ethers";
import { ArrowDown, InfoIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { LinkToken } from "./Token";
import ReuseTable from "./ReuseTable";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  BLOCK_EXPLORER_LINK,
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { Heading } from "@/components/ui/Typography";
import InfiniteScroll from "react-infinite-scroll-component";

const transactionTypes = {
  swap: GET_SWAP_DATA,
  add: GET_ADD_LIQUIDITY_DATA,
  remove: GET_REMOVE_LIQUIDITY_DATA,
};

const labels = [
  { name: "Wallet" },
  { name: "Type" },
  { name: "Amount In" },
  { name: "Amount out" },
  { name: "Tx Hash" },
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

const liquidityLabels = [
  labels[0],
  labels[1],
  { name: "Token 1" },
  { name: "Token 2" },
  labels[4],
  labels[5],
];

const TableCellLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    className={cn(
      buttonVariants({ variant: "link", size: "sm" }),
      "text-muted-foreground p-0 m-0"
    )}
    target="_blank"
    href={href}
  >
    {children}
  </Link>
);

const TableCellWithToken = ({
  amount,
  tokenAddress,
}: {
  amount: string;
  tokenAddress: string;
}) => (
  <div className="flex items-center gap-x-2 text-base">
    {formatNumber(ethers.formatUnits(amount))}{" "}
    <LinkToken address={tokenAddress} />
  </div>
);

const renderTableRow = (
  transaction: any,
  type: keyof typeof transactionTypes,
  isSwap: boolean
) => (
  <TableRow key={transaction.transactionHash}>
    <TableCell className="py-5">
      {shortenString(transaction.swapper || transaction.provider)}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-x-2 text-muted-foreground">
        {isSwap ? "Swap" : type === "add" ? "Add" : "Remove"}
        <LinkToken
          address={
            isSwap ? transaction.tokenIn : STAKING_TOKEN_CONTRACT_ADDRESS
          }
        />
        {isSwap ? "For" : "and"}{" "}
        <LinkToken
          address={isSwap ? transaction.tokenOut : REWARD_TOKEN_ADDRESS}
        />
      </div>
    </TableCell>
    <TableCell>
      <TableCellWithToken
        amount={isSwap ? transaction.amountIn : transaction.amount1}
        tokenAddress={
          isSwap ? transaction.tokenIn : STAKING_TOKEN_CONTRACT_ADDRESS
        }
      />
    </TableCell>
    <TableCell>
      <TableCellWithToken
        amount={isSwap ? transaction.amountOut : transaction.amount2}
        tokenAddress={isSwap ? transaction.tokenOut : REWARD_TOKEN_ADDRESS}
      />
    </TableCell>
    <TableCell>
      <TableCellLink
        href={`${BLOCK_EXPLORER_LINK}/tx/${transaction.transactionHash}`}
      >
        {shortenString(transaction.transactionHash)}
      </TableCellLink>
    </TableCell>
    <TableCell className="font-medium text-right">
      <TableCellLink
        href={`${BLOCK_EXPLORER_LINK}/tx/${transaction.transactionHash}`}
      >
        {moment(new Date(transaction.blockTimestamp * 1000)).fromNow()}
      </TableCellLink>
    </TableCell>
  </TableRow>
);

export default function TransactionTable({
  type,
}: {
  type: keyof typeof transactionTypes;
}) {
  const key =
    type === "swap"
      ? "swappeds"
      : type === "add"
      ? "liquidityProvideds"
      : "liquidityRemoveds";
  const PER_PAGE = 50; // Number of transactions to fetch per page
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useQuery(transactionTypes[type], {
    variables: { first: PER_PAGE, skip: 0 },
  });
  console.log("data:", data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data[key]?.length)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-4">
        <Heading variant="h5" className="flex items-center gap-x-2">
          <InfoIcon className="text-muted-foreground h-5 w-5" />
          No Data Found
        </Heading>
        <p className="mb-6 md:px-20">
          We couldn&#39;t find any data matching your criteria. Try adjusting
          your filter or check back later.
        </p>
        <Button variant={"outline"} onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    );

  // 🧑to be added on the infinite scroll or pagnination
  const handleLoadMore = () => {
    console.log("fetching more...");
    fetchMore({
      variables: {
        skip: (page + 1) * PER_PAGE,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        console.log("fetch more result:", fetchMoreResult);
        if (!fetchMoreResult[key].length) {
          setHasMore(false);
          return previousResult;
        }
        console.log("fetchMoreData", fetchMoreResult);
        setPage((prevPage) => prevPage + 1);

        return {
          ...previousResult,
          [key]: [...previousResult[key], ...fetchMoreResult[key]],
        };
      },
    });
  };

  const tableLabels = type === "swap" ? labels : liquidityLabels;
  const isSwap = type === "swap";

  return (
    <ReuseTable labels={tableLabels}>
      {data[key].map((transaction: any) =>
        renderTableRow(transaction, type, isSwap)
      )}
    </ReuseTable>
  );
}
