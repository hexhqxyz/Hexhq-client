import React from "react";
import { Card, CardTitle } from "../ui/card";
import { Heading } from "../ui/Typography";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

type InfoLabelProps = {
  label: string;
  value: string;
  isSeperator?: boolean;
  className?: string;
};
export const InfoLabel = ({
  label,
  value,
  isSeperator = true,
  className,
}: InfoLabelProps) => (
  <>
    <div className={cn("space-y-1", className)}>
      <p className="text-sm">{label}</p>
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