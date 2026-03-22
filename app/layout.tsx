import type { Metadata } from "next";
import "./globals.css";
import { ReactLenis } from "lenis/react";


export const metadata: Metadata = {
  title: "ICpEP Booth Games",
  description: "This is a collection of games for the ICpEP booth.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon1.png" type="image/png" sizes="32x32" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ReactLenis root options={{ lerp: 0.1, duration: 0.5, smoothWheel: true }} >
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
