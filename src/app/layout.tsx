import type { Metadata } from "next";
import { Bebas_Neue, Archivo, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebasNeue",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Fresh or Rotten",
  description: "Fruit classifier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full antialiased", "font-sans", inter.variable)}>
      <body
        className={`${archivo.variable} ${bebasNeue.variable} font-archivo text-primary bg-background overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
