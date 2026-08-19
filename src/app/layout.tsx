import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dr.shell Private Study',
  description: 'Dr.shell',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}