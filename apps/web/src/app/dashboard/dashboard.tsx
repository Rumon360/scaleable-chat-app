"use client";

import ChatCard from "@/components/chat/card";
import CreateChat from "@/components/chat/create";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";

import { getAllChats } from "@/lib/queries";

import type { ChatGroupType } from "@/lib/types";

import { useSuspenseQuery } from "@tanstack/react-query";

import EditDialog from "@/components/chat/edit-dialog";

import { useState } from "react";
import { DeleteDialog } from "@/components/chat/delete-dialog";

interface DashboardTypes {
  session: typeof authClient.$Infer.Session;
}

export default function Dashboard({ session }: DashboardTypes) {
  const [selectedChat, setSelectedChat] = useState<{
    type: "edit" | "del";
    id: string;
  } | null>(null);

  const {
    data: chats,
    isLoading,
    refetch: refetchChatGroups,
  } = useSuspenseQuery({
    queryKey: ["chat-groups"],
    queryFn: getAllChats,
  });

  const hasChats = chats?.data && chats?.data.length > 0;

  const handleSelectedChat = (type: "edit" | "del", id: string) => {
    setSelectedChat({
      type: type,
      id: id,
    });
  };

  return (
    <div className="pt-8">
      <div className="w-full flex flex-wrap gap-4">
        {isLoading &&
          [...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="w-full sm:w-72 border borderbo lg:w-80 aspect-[16/6]"
            />
          ))}
        {!isLoading &&
          hasChats &&
          chats.data.map((chat: ChatGroupType) => (
            <ChatCard
              handleSelectedChat={handleSelectedChat}
              key={chat.id}
              chat={chat}
            />
          ))}
        {!isLoading && !hasChats && (
          <Card className="flex items-center bg-accent animate-pulse justify-center w-full sm:w-72 lg:w-80 aspect-[16/6]">
            <p className="text-muted-foreground">
              No chats found. Create one to get started!
            </p>
          </Card>
        )}
        <CreateChat user={session.user} refetchChatGroups={refetchChatGroups} />
        <EditDialog
          chats={chats.data}
          selectedChat={selectedChat}
          refetchChatGroups={refetchChatGroups}
          setSelectedChat={setSelectedChat}
        />
        <DeleteDialog
          selectedChat={selectedChat}
          refetchChatGroups={refetchChatGroups}
          setSelectedChat={setSelectedChat}
        />
      </div>
    </div>
  );
}
