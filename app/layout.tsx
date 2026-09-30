import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "@/components/demo-provider";
import { Nav } from "@/components/nav";
import { TestGuide } from "@/components/test-guide";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono-jb", subsets: ["latin"] });

// Runs before first paint: saved choice, else the system setting.
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export const metadata: Metadata = {
  title: "Invicta — Demo",
  description: "Clickable demo with sample data. No real patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full text-stone-900">
        <div className="frame dash-x mx-auto flex min-h-screen max-w-[1400px] flex-col">
          <div className="dash-b flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-stone-50 px-4 py-2 text-center font-mono text-[11px] text-stone-500">
            <span>Demo with sample data. All patients, photos, and numbers are invented. Nothing is saved.</span>
            <TestGuide />
          </div>
          <DemoProvider>
            <div className="flex flex-1 flex-col md:flex-row">
              <Nav />
              <main className="min-w-0 flex-1 p-4 md:p-10">{children}</main>
            </div>
          </DemoProvider>
        </div>
      </body>
    </html>
  );
}
