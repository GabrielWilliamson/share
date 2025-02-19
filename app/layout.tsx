import type React from "react";
import type { Metadata } from "next";
import { Geist, Azeret_Mono as Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Link from "next/link";
import { List } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clase - Herramienta para compartir archivos",
  description: "Una plataforma para compartir y gestionar archivos de clase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-black text-white">
      <ConvexClientProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <header className="z-10 border-b border-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <h1 className="text-2xl font-bold text-white">
                  Herramienta para compartir archivos
                </h1>
                <Link
                  href="/"
                  className="flex items-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
                >
                  <List className="mr-2" size={18} />
                  Listado de Clases
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-grow bg-black">{children}</main>

          <footer className="border-t border-gray-800 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-400">
                Creado por Gabriel 👏
              </p>
            </div>
          </footer>
        </body>
      </ConvexClientProvider>
    </html>
  );
}
