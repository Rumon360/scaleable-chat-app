import { Hash } from "lucide-react";
import SidebarSheet from "@/components/chat/sidebar-sheet";

interface ChatHeaderProps {
  title: string;
  participants: any[];
}

export default function ChatHeader({ title, participants }: ChatHeaderProps) {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center justify-between w-full md:justify-start gap-3">
        <div className="flex flex-col">
          <h3 className="font-bold flex items-center gap-2">
            <Hash className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{title}</span>
          </h3>
        </div>
        <div className="md:hidden">
          <SidebarSheet participants={participants} />
        </div>
      </div>
    </header>
  );
}
