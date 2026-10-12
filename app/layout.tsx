import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: [
    { path: '../public/fonts/inter-400.ttf', weight: '400' },
    { path: '../public/fonts/inter-500.ttf', weight: '500' },
    { path: '../public/fonts/inter-600.ttf', weight: '600' },
    { path: '../public/fonts/inter-700.ttf', weight: '700' },
  ],
  variable: '--font-inter',
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
  return <html lang="en"><body className={`${inter.variable} ${inter.className}`}>{children}</body></html>;
}
