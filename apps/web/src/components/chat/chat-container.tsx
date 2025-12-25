"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { v4 as uuidv4 } from "uuid";

import { getChat } from "@/lib/queries";
import { getSocket } from "@/lib/socket.config";
import type { authClient } from "@/lib/auth-client";
import type { MessageType } from "@/lib/types";

import SidebarContent from "@/components/chat/sidebar-content";
import JoinChatDialog from "@/components/chat/join-chat-dialog";
import ChatHeader from "@/components/chat/chat-header";
import MessageList from "@/components/chat/message-list";
import MessageInput from "@/components/chat/message-input";

type Props = {
  chatId: string;
  session: typeof authClient.$Infer.Session;
};

export default function ChatContainer({ chatId, session }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { data: chat, refetch } = useSuspenseQuery({
    queryKey: ["chat-group", chatId],
    queryFn: () => getChat(chatId),
  });

  const socket = useMemo(() => {
    const s = getSocket();
    s.auth = { room: chat.data.id };
    return s.connect();
  }, [chat.data.id]);

  useEffect(() => {
    if (chat.data.isNotMember) setOpen(true);
    if (chat.data.chats) setMessages(chat.data.chats);
  }, [chat.data]);

  useEffect(() => {
    socket.on("message", (data: MessageType) => {
      setMessages((prev) => [...prev, data]);
    });
    return () => {
      socket.close();
    };
  }, [socket]);

  const handleSendMessage = (content: string) => {
    const payload = {
      id: uuidv4(),
      message: content,
      group_id: chat.data.id,
      createdAt: new Date().toISOString(),
    };
    socket.emit("message", payload);
  };

  if (open) {
    return (
      <JoinChatDialog
        open={open}
        setOpen={setOpen}
        group_id={chatId}
        refetch={refetch}
      />
    );
  }

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <aside className="hidden md:flex w-72 border-r flex-col shrink-0">
        <SidebarContent participants={chat.data.groupUsers} />
      </aside>

      <main className="flex flex-col flex-1 min-w-0">
        <ChatHeader
          title={chat.data.title}
          participants={chat.data.groupUsers}
        />
        <MessageList messages={messages} currentUserId={session.user.id} />
        <MessageInput onSend={handleSendMessage} />
      </main>
    </div>
  );
}
