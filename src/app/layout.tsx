import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const openSans = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Space",
  description: "A realtime collaboration and Team chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${openSans.className} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
