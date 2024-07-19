"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { X } from "lucide-react";
import { Button } from "./button";
import { Heading } from "./Typography";

type ExpandableCardProps = {
  children: React.ReactNode;
  id?: string;
  title?: React.ReactNode;
  expandedContent: React.ReactNode;
};

export function ExpandableCard({
  id,
  children,
  expandedContent,
  title
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  useOnClickOutside(ref, () => setIsExpanded(false));

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${id}`}
              ref={ref}
              className="w-full px-4 py-2 max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div className="flex justify-between items-center w-full">
                <Heading variant="h4">{title}</Heading>
                <Button variant={"ghost"} size={"icon"} onClick={() => setIsExpanded(false)}>
                  <X />
                </Button>
              </div>
              {expandedContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.div
        // layoutId={`card-${id}`}
        onClick={() => setIsExpanded(true)}
      >
        {children}
      </motion.div>
    </>
  );
}
