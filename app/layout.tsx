import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Providers from '@/components/providers';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'リアルタイムマウス共有ポートフォリオ',
  description: 'Firebase Realtime Databaseを使用したリアルタイムマウス位置共有ポートフォリオサイト',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}