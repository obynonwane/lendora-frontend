import type { Metadata } from "next";
import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Initialize your fonts
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Define your metadata for the page
export const metadata: Metadata = {
  title: "Lendora",
  description: "Welcome to Lendora.",
};

// The RootLayout component that wraps your entire application
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // HTML tag with language and full height
    <html lang="en" className="h-full relative">
      <head>
        {/* Font Awesome CSS link for icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-AB+...==" // IMPORTANT: Use your actual integrity hash here!
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>

      <body
        className={`${dmSans.variable} ${geistMono.variable} ${dmSans.className} antialiased   text-slate-700 h-full flex flex-col`}
      >
        {/* Your application's Header component, has position=sticky */}
        <Header />

        {/* React-Toastify container for notifications */}
        <ToastContainer
          style={{
            zIndex: 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999,
          }}
        />

        {children}

        <Footer />
      </body>
    </html>
  );
}
