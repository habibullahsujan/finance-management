import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/providers/query-provider";
import { SheetProvider } from "@/providers/sheet-provider";
import { Toaster } from "@/components/ui/sonner";


export const metadata: Metadata = {
  title: "Finance Management",
  description: "Your online personal finance manager.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <QueryProvider>
            <SheetProvider/>
            <Toaster/>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>

  );
}
