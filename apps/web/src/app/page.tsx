import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="pt-32">
      <div className="container mx-auto max-w-3xl">
        <div className="flex flex-col justify-center items-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold">
              Scaleable Chat App
            </h1>
            <h2 className="text-xl lg:text-2xl font-medium">
              Create instant chat links for seamless conversations. Start your
              conversation now.
            </h2>
          </div>
          <div>
            <Link href={"/dashboard"}>
              <Button size={"lg"} className={"text-base py-4 px-4"}>
                Start now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
