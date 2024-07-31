import { cn } from "@/lib/utils";
import React from "react";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default ReuseTable;
