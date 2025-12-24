import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

function SidebarContent({}: Props) {
  return (
    <div className="flex flex-col h-full bg-muted/20">
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-0.5">
          <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Members
          </p>
          {/* {chat?.participants?.map((user: any) => (
            <button
              key={user.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-background transition-all group border border-transparent hover:border-border/50 shadow-none hover:shadow-sm"
            >
              <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              <div className="text-left overflow-hidden">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {user.name}
                </p>
              </div>
            </button>
          ))} */}
        </div>
      </ScrollArea>
    </div>
  );
}

export default SidebarContent;
