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
    <html lang="en" className="h-full">
      <head>
        {/* Font Awesome CSS link for icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-AB+...==" // IMPORTANT: Use your actual integrity hash here!
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      {/* Body tag configured as a flex column for overall layout.
          min-h-screen ensures it's at least screen height, but allows it to grow.
          No h-screen, no overflow-hidden here. The body itself can scroll.
      */}
      <body
        className={`${dmSans.variable} ${geistMono.variable} ${dmSans.className} antialiased bg-white text-slate-700 flex flex-col min-h-screen`}
      >
        {/* Your application's Header component */}
        <Header />

        {/* React-Toastify container for notifications */}
        <ToastContainer
          style={{
            zIndex: 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999,
          }}
        />

        {/* Main content area.
            - flex-1: Allows it to grow and take all available vertical space between Header and Footer.
                      This ensures the footer is pushed to the bottom if content is short.
            - No overflow-hidden here. The body will scroll if content is long.
        */}
        <div className="flex-1">
          {children} {/* This is where your page components will be rendered */}
        </div>

        {/* Your application's Footer component */}
        <Footer />
      </body>
    </html>
  );
}
