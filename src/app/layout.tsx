import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from 'next/script';
import "./globals.css";
import { headers } from 'next/headers';
import MsalClientProvider from "@/components/Providers/MsalClientProvider";
import GoogleScriptProvider from "@/components/Providers/GoogleScriptProvider";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY || '');

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: '%s | PDF Tools',
    default: 'PDF Tools - Make PDF Easy'
  },
  description: "Professional PDF tools for everyone",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: { lang?: string };
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  const lang = pathname.startsWith('/cn') ? 'zh' :
               pathname.startsWith('/ar') ? 'ar' :
               pathname.startsWith('/fr') ? 'fr' :
               pathname.startsWith('/es') ? 'es' :
               pathname.startsWith('/pt') ? 'pt' : 'en';

  return (
    <html lang={lang}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JWKNLZVBMP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JWKNLZVBMP');
          `}
        </Script>
        <Script 
          src="/js/pdf.min.js"
          strategy="beforeInteractive"
        />
        <Script 
          src="/js/pdf.worker.min.js"
          strategy="beforeInteractive"
        />
        <GoogleScriptProvider />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MsalClientProvider>
          {children}
        </MsalClientProvider>
      </body>
    </html>
  );
}
