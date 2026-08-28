import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: "TechStore - Nền tảng thương mại điện tử",
  description: "Mua sắm thiết bị công nghệ chính hãng, điện thoại, laptop, phụ kiện giá tốt nhất."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <SiteHeader />
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
