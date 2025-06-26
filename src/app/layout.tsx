import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import MainLayoutWrapper from '@/components/main-layout-wrapper';
import { CartProvider } from '@/hooks/use-cart';

export const metadata: Metadata = {
  title: 'EcoGrocer Hub',
  description: 'An e-commerce platform for eco-friendly products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
