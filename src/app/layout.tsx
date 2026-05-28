import type { Metadata } from "next";
import { Bebas_Neue, Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import AppProvider from "@/providers/app-provider";
import { Toaster } from "@/components/ui/sonner";
import { LoadingProvider } from "@/context/loading-context";
import GlobalLoading from "@/components/Loading";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebasNeue",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-sourceSerif",
  weight: ["300", "400", "500", "600"],
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "800"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Fresh or Trash",
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
        className={`${archivo.variable} ${bebasNeue.variable} ${sourceSerif.variable} font-archivo text-primary bg-background overflow-x-hidden min-h-screen antialiased`}
      >
        <AppProvider>
          <LoadingProvider>
            <GlobalLoading />
            <Toaster position="top-center" richColors />
            {children}
          </LoadingProvider>
        </AppProvider>
      </body>
    </html>
  );
}
