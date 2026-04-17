import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GolfHeroes — Play. Give. Win.",
  description:
    "Golf performance tracking, monthly prize draws, and charitable giving. Join a community of heroes on and off the course.",
  openGraph: {
    title: "GolfHeroes — Play. Give. Win.",
    description: "Golf performance tracking with purpose.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-carbon-950 text-carbon-100 font-body antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: "#1A1A1A",
              border: "1px solid #383838",
              color: "#F5F5F5",
            },
          }}
        />
      </body>
    </html>
  );
}
