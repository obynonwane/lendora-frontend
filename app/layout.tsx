import type { Metadata } from "next";
import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lendora",
  description: "Welcome to Lendora.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${geistMono.variable} ${dmSans.className} antialiased`}
      >
        <Header />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
