"use client";

import CreateChat from "@/components/chat/create";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { authClient } from "@/lib/auth-client";

import { getAllChats } from "@/lib/queries";

import type { CreateChatForm } from "@/lib/types";

import { useSuspenseQuery } from "@tanstack/react-query";

interface DashboardTypes {
  session: typeof authClient.$Infer.Session;
}

type ChatDataSchema = CreateChatForm & {
  id: string;
};

export default function Dashboard({ session }: DashboardTypes) {
  const {
    data: chats,
    isLoading,
    refetch: refetchChatGroups,
  } = useSuspenseQuery({
    queryKey: ["chat-groups"],
    queryFn: getAllChats,
  });

  const hasChats = chats?.data && chats?.data.length > 0;

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
          chats.data.map((chat: ChatDataSchema) => (
            <Card
              key={chat.id}
              className="flex items-center bg-accent justify-center group cursor-pointer w-full sm:w-72 lg:w-80 aspect-[16/6]"
            >
              <CardContent>
                <p className="text-base group-hover:text-blue-500 transition-colors text-center font-medium">
                  {chat.title}
                </p>
              </CardContent>
            </Card>
          ))}
        {!isLoading && !hasChats && (
          <Card className="flex items-center bg-accent animate-pulse justify-center w-full sm:w-72 lg:w-80 aspect-[16/6]">
            <p className="text-muted-foreground">
              No chats found. Create one to get started!
            </p>
          </Card>
        )}
        <CreateChat user={session.user} refetchChatGroups={refetchChatGroups} />
      </div>
    </div>
  );
}
