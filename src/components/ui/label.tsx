"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { TooltipWrapper } from "./tooltip";
import { ArrowRight } from "lucide-react";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

type LabelValueRow = {
  label: React.ReactNode;
  value?: React.ReactNode;
  tooltip?: React.ReactNode;
  className?: string;
};
export const LabelValueRow = ({
  label,
  value,
  tooltip,
  className,
}: LabelValueRow) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center text-muted-foreground",
        className
      )}
    >
      <div className="font-semibold py-1 rounded-sm flex items-center gap-x-1">
        <span>{label}</span>
        {tooltip && <TooltipWrapper>{tooltip}</TooltipWrapper>}
      </div>
      {value && (
        <p className="py-1 rounded-sm flex items-center gap-x-2">{value}</p>
      )}
    </div>
  );
};

export { Label };
