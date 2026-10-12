import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kinfolk Family Directory',
    short_name: 'Kinfolk',
    description: 'Your family and community in one place.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f2ef',
    theme_color: '#f6f2ef',
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
