import type { Metadata } from "next";
import "./globals.css";
import { alata } from "./fonts";
import { montserrat } from "./fonts";
import NavbarLaunch from "./components/NavbarLaunch";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "EpicCare Insights",
  description: "Epic + AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body suppressHydrationWarning={true}>
        <NavbarLaunch />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
