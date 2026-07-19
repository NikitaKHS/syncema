import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { AppProviders } from '@/components/providers';
import './globals.css';

const manrope = Manrope({ subsets: ['cyrillic', 'latin'], variable: '--font-manrope' });
export const metadata: Metadata = { title: 'Video Together — смотрите вместе', description: 'Синхронные YouTube-комнаты для друзей на любом устройстве.', applicationName: 'Video Together' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" data-scroll-behavior="smooth" suppressHydrationWarning><body className={manrope.variable}><AppProviders>{children}</AppProviders></body></html>;
}
