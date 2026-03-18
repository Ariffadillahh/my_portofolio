import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./providers/redux";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arif Fadillah Wicaksono | Web Developer",
  description: "Portofolio digital Arif Fadillah Wicaksono. Menampilkan berbagai proyek web development modern, termasuk pengembangan aplikasi terintegrasi seperti Decisify dan ParfumeGue.",
  keywords: [
    "Arif Fadillah Wicaksono",
    "Arif Fadillah",
    "Web Developer Indonesia",
    "Portofolio Web Developer",
    "Next.js Developer",
    "Software Engineer"
  ],
  authors: [{ name: "Arif Fadillah Wicaksono" }],
  creator: "Arif Fadillah Wicaksono",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://domain-kamu.com", 
    title: "Arif Fadillah Wicaksono | Web Developer",
    description: "Portofolio digital Arif Fadillah Wicaksono. Jelajahi proyek web development modern yang telah saya bangun.",
    siteName: "Arif Fadillah Wicaksono Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ReduxProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
