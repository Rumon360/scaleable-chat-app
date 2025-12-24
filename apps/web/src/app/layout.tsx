import type { Metadata } from "next";

import { Space_Grotesk } from "next/font/google";

import "@/index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const space_grotesk = Space_Grotesk({
  variable: "--space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Scaleable Chat App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${space_grotesk.className} antialiased`}>
        <Providers>
          <div className="grid grid-rows-[auto_1fr] h-svh bg-linear-to-b from-background via-white to-blue-500/50">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
