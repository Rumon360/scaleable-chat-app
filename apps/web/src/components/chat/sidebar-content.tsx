import { ScrollArea } from "@/components/ui/scroll-area";
import type { GroupChatUserType } from "@/lib/types";

type Props = {
  participants: GroupChatUserType[];
};

function SidebarContent({ participants }: Props) {
  return (
    <div className="flex flex-col h-full bg-muted/20">
      <ScrollArea className="flex-1 py-4">
        <div>
          <p className="text-sm font-bold tracking-wider text-muted-foreground px-4 mb-2">
            Members
          </p>
          <div className="px-4 py-2 space-y-2">
            {participants.map((user) => (
              <button
                key={user.name}
                className="w-full flex items-center gap-3 px-3 py-2.5 bg-background group border border-border shadow-sm"
              >
                <div className="text-left overflow-hidden">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {user.name}
                  </p>
                  <p className="text-xs">
                    Joined:{" "}
                    <span>{new Date(user.createdAt).toDateString()}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default SidebarContent;
