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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${inter.className}`}>{children}</body></html>;
}
