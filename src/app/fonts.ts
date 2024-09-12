import { Inter, Alata, Montserrat } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const alata = Alata({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alata",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});
