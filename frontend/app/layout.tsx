import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Women Fashion - Premier Boutique in Visakhapatnam | Designer Blouses & Maggam Work",
  description: "Women Fashion - Premier Designing & Stitching Boutique in Visakhapatnam. Specializing in Maggam Work, Designer Blouses, Saree Fall & Pico, Custom Stitching. Perfect Fit, Elegant Designs since 2011.",
  keywords: ["boutique visakhapatnam", "designer blouses", "maggam work", "saree stitching", "custom tailoring", "Women Fashion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${poppins.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
