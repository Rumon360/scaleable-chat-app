import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-full w-full grid place-content-center">
      <div className="p-4 bg-white shadow border border-border max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">Not Found :(</h2>
        <p>Could not find requested resource</p>
        <Link href="/" className="text-blue-500">
          Return Home
        </Link>
      </div>
    </div>
  );
}
