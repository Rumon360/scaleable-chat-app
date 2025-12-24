"use client";

import type { authClient } from "@/lib/auth-client";
import { getChat } from "@/lib/queries";
import { getSocket } from "@/lib/socket.config";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  chatId: string;
  session: typeof authClient.$Infer.Session;
};

function ChatContainer({ chatId, session }: Props) {
  const {
    data: chat,
    isLoading,
    refetch: refetchChatGroup,
  } = useSuspenseQuery({
    queryKey: ["chat-group", chatId],
    queryFn: () => getChat(chatId),
  });

  const socket = useMemo(() => {
    const socket = getSocket();
    return socket.connect();
  }, []);

  useEffect(() => {
    socket.on("message", (data: any) => {
      console.log("SOCKET_MESSAGE", data);
    });
    return () => {
      socket.close();
    };
  }, []);

  const handleSend = () => {
    socket.emit("message", { name: session.user.name, id: uuidv4() });
  };

  return (
    <div>
      <button onClick={handleSend}>test</button>
    </div>
  );
}

export default ChatContainer;
