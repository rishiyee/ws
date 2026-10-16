import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const inter = localFont({
  src: [
    { path: '../public/fonts/inter-400.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/inter-500.ttf', weight: '500', style: 'normal' },
    { path: '../public/fonts/inter-600.ttf', weight: '600', style: 'normal' },
    { path: '../public/fonts/inter-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Vinkling — Family directory',
  description: 'Your family and community in one place.',
  applicationName: 'Vinkling',
  appleWebApp: {
    capable: true,
    title: 'Vinkling',
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
  return <html lang="en" suppressHydrationWarning><body className={inter.variable}>{children}</body></html>;
}
