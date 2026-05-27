import type { Metadata } from "next";
import { Bebas_Neue, Archivo } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/app-provider";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebasNeue",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
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
    <html lang="en">
      <body
        className={`${archivo.variable} ${bebasNeue.variable} font-archivo text-primary bg-background overflow-x-hidden min-h-screen antialiased`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
