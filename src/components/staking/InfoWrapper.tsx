import React from "react";
import { Card, CardTitle } from "../ui/card";
import { Heading } from "../ui/Typography";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "../ui/tooltip";

type InfoLabelProps = {
  label: string;
  value: string;
  isSeperator?: boolean;
  className?: string;
  tooltip?: string;
};
export const InfoLabel = ({
  label,
  value,
  isSeperator = true,
  tooltip,
  className,
}: InfoLabelProps) => (
  <>
    <div className={cn("space-y-1", className)}>
    <div className="flex items-center gap-x-1">
        <span className="text-sm">{label}</span>
        {tooltip && <TooltipWrapper>{tooltip}</TooltipWrapper>}
      </div>

      <Heading variant="h5">{value}</Heading>
    </div>
    {isSeperator && (
      <div>
        <Separator orientation="vertical" />
      </div>
    )}
  </>
);

type InfoWrapperProps = {
  title: string;
  children: React.ReactNode;
};
export const InfoWrapper = ({ title, children }: InfoWrapperProps) => {
  return (
    <Card className="border p-4">
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="mt-6">
        <div className="flex gap-x-6">{children}</div>
      </div>
    </Card>
  );
};