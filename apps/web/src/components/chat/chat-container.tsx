"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Send, Hash, Menu } from "lucide-react";

import { getChat } from "@/lib/queries";
import { getSocket } from "@/lib/socket.config";
import type { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarContent from "@/components/chat/sidebar-content";
import SidebarSheet from "@/components/chat/sidebar-sheet";

import { cn } from "@/lib/utils";

type Props = {
  chatId: string;
  session: typeof authClient.$Infer.Session | null;
};

function ChatContainer({ chatId, session }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const { data: chat } = useSuspenseQuery({
    queryKey: ["chat-group", chatId],
    queryFn: () => getChat(chatId),
  });

  const socket = useMemo(() => {
    const socket = getSocket();
    socket.auth = { room: chatId };
    return socket.connect();
  }, [chatId]);

  useEffect(() => {
    socket.on("message", (data: any) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.close();
    };
  }, [socket]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const payload = {
      name: session?.user.name || "User",
      id: uuidv4(),
    };

    socket.emit("message", payload);
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <div className="flex w-full overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex w-72 border-r flex-col shrink-0">
          <SidebarContent />
        </aside>
        {/* MAIN CHAT AREA */}
        <main className="flex flex-col flex-1 min-w-0">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarSheet />
              <div className="flex flex-col">
                <h3 className="font-bold flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {chat?.name || "Discussion"}
                </h3>
              </div>
            </div>
          </header>

          <ScrollArea className="flex-1 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              {messages.map((msg) => {
                const isMe = msg.senderId === session?.user.id;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex flex-col",
                      isMe ? "items-end" : "items-start"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5 px-1">
                      {!isMe && (
                        <span className="text-[11px] font-bold text-primary">
                          {msg.name}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                        {msg.timestamp}
                      </span>
                      {isMe && (
                        <span className="text-[11px] font-bold text-muted-foreground ml-1">
                          You
                        </span>
                      )}
                    </div>

                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-[14px] leading-relaxed max-w-[90%] md:max-w-[85%]",
                        isMe
                          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="p-4 md:p-6 bg-background">
            <form
              onSubmit={handleSend}
              className="max-w-2xl mx-auto relative flex items-center gap-2"
            >
              <Input
                placeholder="Write a message..."
                className="h-12 px-4 rounded-xl bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/30 transition-all shadow-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                type="submit"
                className="h-12 w-12 rounded-xl shrink-0 transition-transform active:scale-90"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ChatContainer;
