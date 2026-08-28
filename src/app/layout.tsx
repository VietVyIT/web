import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web ban hang thiet bi",
  description: "Nen tang thuong mai dien tu cho thiet bi cong nghe."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

