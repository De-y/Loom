import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loom",
  description: "A volunteer-based tutoring app for the students, by the students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
