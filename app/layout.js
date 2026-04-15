import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: '%s | ZAM Edutoys',
    default: 'ZAM Edutoys | Produsen Mainan Edukasi Premium',
  },
  description: 'Pusat mainan edukasi kayu premium untuk anak usia dini. Asah motorik, sensori, dan kognitif si kecil dengan mainan yang aman, kuat, dan edukatif.',
  keywords: ['mainan edukasi kayu', 'mainan anak', 'montessori', 'ZAM Edutoys', 'produsen mainan edukasi'],
  authors: [{ name: 'ZAM Edutoys' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ZAM Edutoys | Produsen Mainan Edukasi Premium',
    description: 'Pusat mainan edukasi premium untuk anak. Kami fokus dalam meredesain kemandirian anak dengan produk edukasi terbaik.',
    url: 'https://zamedutoys.com',
    siteName: 'ZAM Edutoys',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'ZAM Edutoys Logo',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZAM Edutoys',
    description: 'Produsen Mainan Edukasi Premium Indonesia',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

