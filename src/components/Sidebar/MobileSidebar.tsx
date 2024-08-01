"use client";

import React, { Fragment, useState } from "react";
import MySidebar, { MenuLink } from "./MySidebar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { HomeIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { headingClasses } from "../ui/Typography";
import ConnectButton from "../ConnectWallet";
import { links } from "@/lib/links";

type Props = {};

const MobileSidebar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Drawer direction="left" onOpenChange={setIsOpen} open={isOpen}>
        <DrawerTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MenuIcon className="text-muted-foreground" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-5/6">
          <div className="h-screen overflow-y-auto">
            <DrawerHeader className="">
              <div className="flex items-center justify-between">
                <Link className={cn(headingClasses["h4"])} href={"/"}>
                  OmniDeFi
                </Link>
                <DrawerClose>
                  <Button autoFocus variant={"ghost"} size={"icon"}>
                    <XIcon className="text-muted-foreground w-5 h-5" />
                  </Button>
                </DrawerClose>
              </div>
              <div onClick={() => setIsOpen(!isOpen)}>
                <ConnectButton isMobile={true} />
              </div>
            </DrawerHeader>

            <div className="flex flex-col h-full">
              <div className="overflow-x-hidden">
                <ul className="flex flex-col space-y-1">
                  {links.map((item, index) => (
                    <Fragment key={index}>
                      <li className="px-5">
                        <div className="flex flex-row items-center h-8">
                          <div className="text-sm font-light tracking-wide text-muted-foreground">
                            {item.title}
                          </div>
                        </div>
                      </li>
                      {item.subLinks?.map((item, index) => (
                        <div key={index} onClick={() => setIsOpen(false)}>
                          <MenuLink
                            href={item.href}
                            icon={
                              (
                                <item.Icon className="text-muted-foreground h-5 w-5" />
                              ) || (
                                <HomeIcon className="text-muted-foreground h-5 w-5" />
                              )
                            }
                            label={item.label}
                            subLabel={item.subLabel}
                          />
                        </div>
                      ))}
                    </Fragment>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default MobileSidebar;
