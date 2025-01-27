import { CartProvider } from "@/components/cart-provider";
import { LanguageProvider } from "@/components/language-provider";
import { Navigation } from "@/components/navigation";
import { PayPalProvider } from "@/components/paypal-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Geometry & Essences - Sacred Geometry and Flower Essences Shop",
  description:
    "Discover our collection of sacred geometry objects and healing flower essences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>
              <CartProvider>
                <PayPalProvider>
                  <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
                    {/* Geometric Background Pattern */}
                    <div className="fixed inset-0 -z-10 dark:opacity-20 opacity-10">
                      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
                      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-6000" />
                    </div>

                    {/* Sacred Geometry Line Pattern */}
                    <div className="fixed inset-0 -z-10 dark:opacity-5 opacity-10">
                      <svg
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 50 0 L 0 0 0 50"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r="2"
                              fill="currentColor"
                              opacity="0.3"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>

                    <Navigation />
                    <main className="relative pt-16">{children}</main>
                  </div>
                  <Toaster />
                </PayPalProvider>
              </CartProvider>
            </LanguageProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
