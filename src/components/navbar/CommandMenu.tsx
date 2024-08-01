"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  CircleIcon,
  FileIcon,
  LaptopIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
} from "lucide-react";
import { links } from "@/lib/links";

export default function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="flex justify-between items-center text-muted-foreground w-[400px]"
        size={"sm"}
        onClick={() => setOpen(true)}
        {...props}
      >
        <div className="flex items-center gap-x-2">
          <SearchIcon className="text-muted-foreground w-4 h-4" /> Search
        </div>

        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>J
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Links">
            {links.map((link) =>
              link.subLinks.map((subLink) => (
                <CommandItem
                  key={subLink.href}
                  value={subLink.label}
                  onSelect={() => {
                    runCommand(() => router.push(subLink.href));
                  }}
                >
                  <span className="mr-4 h-4 w-4">
                    {<subLink.Icon className="h-5 w-5" />}
                  </span>
                  {subLink.label}
                </CommandItem>
              ))
            )}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
