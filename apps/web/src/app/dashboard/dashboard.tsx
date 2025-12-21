import CreateChat from "@/components/chat/create";
import { authClient } from "@/lib/auth-client";

interface DashboardTypes {
  session: typeof authClient.$Infer.Session;
}

export default function Dashboard({ session }: DashboardTypes) {
  return (
    <div className="pt-8">
      <div className="w-full grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <CreateChat />
      </div>
    </div>
  );
}
