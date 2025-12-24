import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "@/components/chat/sidebar-content";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type Props = {};

function SidebarSheet({}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}

export default SidebarSheet;
