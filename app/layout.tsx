import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edumate ",
  description: "Login and Register Pages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devBodyAttrs = process.env.NODE_ENV !== "production" ? { "cz-shortcut-listen": "true" } : {};

  return (
    <html lang="en">
      <body suppressHydrationWarning {...devBodyAttrs}>
        {children}
      </body>
    </html>
  );
}