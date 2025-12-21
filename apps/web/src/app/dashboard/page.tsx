import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllChats } from "@/lib/queries";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const queryClient = new QueryClient();

  void queryClient.prefetchQuery({
    queryKey: ["chat-groups"],
    queryFn: getAllChats,
  });

  return (
    <div className="px-4 pt-16">
      <h1 className="text-2xl lg:text-3xl font-bold">
        Welcome {session.user.name}
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Dashboard session={session} />
      </HydrationBoundary>
    </div>
  );
}
