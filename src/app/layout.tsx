import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THODZ Builder - Create Stunning Portfolios & Websites",
  description: "Build beautiful, customizable portfolios and websites with our intuitive drag-and-drop builder. Choose from stunning templates and make every element your own.",
  keywords: ["portfolio builder", "website builder", "no-code", "drag and drop", "templates"],
  authors: [{ name: "THODZ" }],
  openGraph: {
    title: "THODZ Builder - Create Stunning Portfolios & Websites",
    description: "Build beautiful, customizable portfolios and websites with our intuitive drag-and-drop builder.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "THODZ Builder - Create Stunning Portfolios & Websites",
    description: "Build beautiful, customizable portfolios and websites with our intuitive drag-and-drop builder.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
