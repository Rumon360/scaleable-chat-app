import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { MessageType } from "@/lib/types";

type Props = {
  messages: MessageType[];
  currentUserId: string;
};

export default function MessageList({ messages, currentUserId }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 md:p-8 h-[80vh]">
      <div className="max-w-2xl mx-auto space-y-6">
        {messages.map((msg: MessageType) => {
          const isMe = msg.from_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={cn(
                "flex flex-col",
                isMe ? "items-end" : "items-start"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5 px-1">
                <span className="text-[11px] font-bold text-muted-foreground">
                  {isMe ? "You" : msg.from.name}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl text-[14px] max-w-[85%]",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted rounded-tl-none"
                )}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
