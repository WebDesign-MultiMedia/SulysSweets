import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata = {
  title: "Suly's Sweets | Custom Cakes & Desserts in the Bronx",
  description:
    "Handmade custom cakes, cupcakes, cheesecakes, and desserts from Suly's Sweets. Pick-up in Pelham Bay, Bronx, with delivery available.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${plusJakarta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
