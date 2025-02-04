import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};
export default function ResizableMain({ children }: Props) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className="h-[calc(100vh-56px)] overflow-hidden"
        defaultSize={15}
        maxSize={20}
        minSize={10}
      >
        <ScrollArea className="h-[calc(100vh-56px)]">
        <Sidebar />
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel
        defaultSize={85}
        minSize={80}
        maxSize={90}
        className="max-h-[calc(100vh-56px)] overflow-hidden"
      >
        <div className="h-full w-full rounded-md overflow-y-auto">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
