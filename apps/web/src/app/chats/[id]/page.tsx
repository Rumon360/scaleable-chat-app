import ChatContainer from "@/components/chat/chat-container";
import { authClient } from "@/lib/auth-client";
import { getChat } from "@/lib/queries";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

async function Chat({ params }: Props) {
  const { id } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  const queryClient = getQueryClient();
  const cookie = (await headers()).get("cookie");

  try {
    await queryClient.fetchQuery({
      queryKey: ["chat-group", id],
      queryFn: () =>
        getChat(id, {
          headers: {
            Cookie: cookie,
          },
        }),
    });
  } catch (error) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatContainer session={session} chatId={id} />
    </HydrationBoundary>
  );
}

export default Chat;
