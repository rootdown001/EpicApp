import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Lance | React Developer",
  description: "React Blog with Placeholder API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div>{children}</div>
        <SpeedInsights />
      </body>
    </html>
  );
}
