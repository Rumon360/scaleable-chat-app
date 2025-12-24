import { Calendar, MoreVertical } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { ChatGroupType } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  chat: ChatGroupType;
  handleSelectedChat: (type: "edit" | "del", id: string) => void;
};

const ChatCard = ({ chat, handleSelectedChat }: Props) => {
  const handleCopy = async () => {
    const BASE_URL = process.env.NEXT_PUBLIC_URL!;
    const url = BASE_URL + `/chats/${chat.id}`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
      console.error("[FAILED_TO_COPY]", err);
    }
  };

  return (
    <Card className="w-full sm:w-72 lg:w-80">
      <CardContent>
        <div className="flex justify-between items-start gap-2">
          <h2 className="text-lg font-semibold text-card-foreground line-clamp-1 flex-1">
            {chat.title}
          </h2>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-md transition-colors">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleCopy} className="gap-2">
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleSelectedChat("edit", chat.id);
                }}
                className="gap-2"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleSelectedChat("del", chat.id);
                }}
                className="gap-2 text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <p className="font-medium text-sm">Passcode: {chat.passcode}</p>
        </div>

        <div className="mt-6 flex items-center gap-2 uppercase tracking-wider font-medium text-muted-foreground">
          <Calendar className="w-3 h-3 -translate-y-0.5" />
          {new Date(chat.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatCard;
