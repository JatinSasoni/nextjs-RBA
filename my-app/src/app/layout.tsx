import type { Metadata } from "next";
import "./globals.css";
import AuthContextProvider from "./Provider/AuthContext";

export const metadata: Metadata = {
  title: "Team Management System",
  description: "Team Management System built with nextjs",
  keywords: ["team", "management", "access-control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-200">
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
