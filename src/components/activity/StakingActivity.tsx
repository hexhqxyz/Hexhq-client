import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { ReuseTable, TableCell, TableCellLink, TableCellWithToken, TableLoadingScreen, TableRow } from "@/components/ui/table";
import moment from "moment";
import {
  GET_STAKE_DATA,
  GET_UNSTAKE_DATA,
  GET_CLAIM_DATA,
  GET_LOAN_TAKEN_DATA,
  GET_LOAN_REPAID_DATA,
} from "@/lib/services/graphql/queries";
import { shortenString } from "@/lib/utils";
import { ArrowDown, InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BLOCK_EXPLORER,
  REWARD_TOKEN_ADDRESS,
  STAKING_TOKEN_CONTRACT_ADDRESS,
} from "@/lib/constants";
import { Heading } from "@/components/ui/Typography";
import { LinkToken } from "../AMM/transactions/Token";

const transactionTypes = {
  stake: GET_STAKE_DATA,
  unstake: GET_UNSTAKE_DATA,
  reward: GET_CLAIM_DATA,
  loanTaken: GET_LOAN_TAKEN_DATA,
  loanRepaid: GET_LOAN_REPAID_DATA,
};

const labels = [
  { name: "Wallet" },
  { name: "Type" },
  { name: "Amount" },
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

const renderTableRow = (
  transaction: any,
  type: keyof typeof transactionTypes
) => (
  <TableRow key={transaction.transactionHash}>
    <TableCell className="py-5">
      {shortenString(transaction.user)}
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-x-2 text-muted-foreground">
        {type === "stake" ? "Stake" : 
         type === "unstake" ? "Unstake" : 
         type === "reward" ? "Rewards" : 
         type === "loanTaken" ? "Loan Taken" : "Loan Repaid"}
        <LinkToken
          address={
            type === "stake" || type === "unstake"
              ? STAKING_TOKEN_CONTRACT_ADDRESS
              : REWARD_TOKEN_ADDRESS
          }
        />
      </div>
    </TableCell>
    <TableCell>
      <TableCellWithToken
        amount={transaction.amount}
        tokenAddress={
          type === "stake" || type === "unstake"
            ? STAKING_TOKEN_CONTRACT_ADDRESS
            : REWARD_TOKEN_ADDRESS
        }
      />
    </TableCell>
    <TableCell>
      <TableCellLink
        href={`${BLOCK_EXPLORER}/tx/${transaction.transactionHash}`}
      >
        {shortenString(transaction.transactionHash)}
      </TableCellLink>
    </TableCell>
    <TableCell className="font-medium text-right">
      <TableCellLink
        href={`${BLOCK_EXPLORER}/tx/${transaction.transactionHash}`}
      >
        {moment(new Date(transaction.blockTimestamp * 1000)).fromNow()}
      </TableCellLink>
    </TableCell>
  </TableRow>
);

export default function StakingTable({
  type,
  address,
}: {
  type: keyof typeof transactionTypes;
  address?: string;
}) {
  const key =
    type === "stake" ? "stakeds" : 
    type === "unstake" ? "withdrawns" : 
    type === "reward" ? "rewardsClaimeds" : 
    type === "loanTaken" ? "loanTakens" : "loanRepaids";

  const PER_PAGE = 50; // Number of transactions to fetch per page
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, data, fetchMore } = useQuery(transactionTypes[type], {
    variables: { first: PER_PAGE, skip: page * PER_PAGE, address: address || "" },
  });
    console.log("data:", data);
  if (loading) return <TableLoadingScreen />;
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

  return (
    <ReuseTable labels={labels}>
      {data[key].map((transaction: any) =>
        renderTableRow(transaction, type)
      )}
    </ReuseTable>
  );
}
