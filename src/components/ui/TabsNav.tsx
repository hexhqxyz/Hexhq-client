"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
  linkClassName?: string;
}

export function TabsNav({
  className,
  linkClassName,
  items,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "inline-flex h-10 items-center justify-center p-1 bg-muted text-muted-foreground w-full rounded-md",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            pathname === item.href && "bg-background text-foreground shadow-sm",
            "inline-flex w-full rounded-md items-center justify-center whitespace-nowrap px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            linkClassName
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
