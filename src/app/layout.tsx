import type { Metadata } from "next";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Wonders | Premium Protein & Supplements",
  description:
    "Premium protein and supplements for athletes. Shop whey, pre-workout, creatine, and more from Daily Wonders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-dw-black text-white antialiased">
        <StoreProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <SearchModal />
        </StoreProvider>
      </body>
    </html>
  );
}
