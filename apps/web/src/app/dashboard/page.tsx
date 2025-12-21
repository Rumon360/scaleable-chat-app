import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

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

  return (
    <div className="px-4 pt-16">
      <h1 className="text-2xl lg:text-3xl font-bold">
        Welcome {session.user.name}
      </h1>
      <Dashboard session={session} />
    </div>
  );
}
