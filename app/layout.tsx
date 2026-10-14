import type { Metadata } from 'next';
import { Host_Grotesk } from 'next/font/google';
import './globals.css';

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-host-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kinfolk — Family directory',
  description: 'Your family and community in one place.',
  applicationName: 'Kinfolk',
  appleWebApp: {
    capable: true,
    title: 'Kinfolk',
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#f6f2ef',
  viewportFit: 'cover' as const,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={hostGrotesk.variable}>{children}</body></html>;
}
