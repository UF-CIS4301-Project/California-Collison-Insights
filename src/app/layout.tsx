import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SideNav from "./components/ui/sidenav";
import WelcomeBar from "./components/ui/welcome-bar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "California Collision Insights",
  description: "Created by Alex, Akhil, Jack, Jean-Luc and Spencer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Extra stuff after antialiased is the graph-looking background on each screen */}
      <body
        className={`${inter.className} antialiased md:p-22 absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]`}
      >
        <WelcomeBar />
        <div className="flex">
          <SideNav />
          <div
            id="screenHeight"
            className="flex flex-col  text-xl pt-10 px-20 pb-20 overflow-y-auto"
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
