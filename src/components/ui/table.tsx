import * as React from "react"

import { cn, formatNumber } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "./button"
import { ethers } from "ethers"
import { LinkToken } from "../AMM/transactions/Token"
import { Skeleton } from "./skeleton"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"



//  Custom Table reusable components --------------------------


const TableLoadingScreen = ({limit=10}) => (
  <div className="flex flex-col space-y-3 p-4">
    <Skeleton className="h-16 rounded-xl" />
    <div className="space-y-4">
      {Array(limit)
        .fill(0)
        .map((item, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
    </div>
  </div>
);



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

type ReuseTableProps = {
  labels: { name: React.ReactNode; className?: string }[];
  children: React.ReactNode;
};
const ReuseTable = ({ labels, children }: ReuseTableProps) => {
  return (
    <div className="w-full">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {labels?.map((item, index) => (
              <TableHead key={index} className={cn(item.className)}>
                {item.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,

  // custom
  TableLoadingScreen,
  TableCellWithToken,
  TableCellLink,
  ReuseTable,

}
