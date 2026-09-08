import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AJ's Closet & Things | Unique Finds",
  description: "Shop affordable clothing, accessories, and everyday finds thoughtfully selected by AJ's Closet & Things.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/brand/aj-monogram-final.png",
    shortcut: "/brand/aj-monogram-final.png",
  },
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
