import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Faro — Your finances, translated.",
  description:
    "Faro maps the financial tools you already know — CIBIL scores, tandas, UPI, paluwagan — to their US equivalents, so you can hit the ground running.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
