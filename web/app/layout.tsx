import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { Nav } from "@/components/nav";
import { TestGuide } from "@/components/test-guide";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Invicta — Demo",
  description: "Clickable demo with sample data. No real patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <div className="bg-slate-900 px-4 py-1.5 text-center text-xs text-slate-100">
          Demo with sample data. All patients, photos, and numbers are invented. Nothing is saved.
          <TestGuide />
        </div>
        <DemoProvider>
          <div className="flex flex-1 flex-col md:flex-row">
            <Nav />
            <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
