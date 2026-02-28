import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import AdminControl from "@/components/admin-control";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Internship Portfolio",
  description: "A minimalist portfolio documenting my internship journey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-white">
       <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black min-h-screen flex flex-col`}
      >
        <div className="fixed inset-0 z-[0] bg-dot-black opacity-40 pointer-events-none" aria-hidden="true" />
        
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="font-bold text-2xl tracking-tighter hover:opacity-70 transition-opacity">
              Naila.
            </Link>
            <nav className="flex items-center gap-8 text-sm font-medium pr-2">
              <Link href="/" className="hover:text-black text-gray-700 transition-colors uppercase tracking-widest text-xs">Home</Link>
              <Link href="/about" className="hover:text-black text-gray-700 transition-colors uppercase tracking-widest text-xs">About</Link>
              <Link href="/blog" className="hover:text-black text-gray-700 transition-colors uppercase tracking-widest text-xs">Archive</Link>
            </nav>
          </div>
        </header>

        <main className="relative z-10 flex-grow max-w-6xl mx-auto px-6 py-20 w-full">
          {children}
        </main>

        <footer className="relative z-10 border-t border-gray-100 py-12 mt-20 bg-white">
           <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-tighter">Naila.</div>
            <div className="text-xs text-gray-600 font-mono uppercase tracking-widest">
              © {new Date().getFullYear()} Naila. — Crafted with Next.js & Tailwind.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
