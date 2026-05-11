import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VisiblyAI — See If AI Recommends Your Business',
  description:
    'Discover how visible your business is across ChatGPT, Google AI Overviews, Gemini, and AI-powered search. Get your free AI Visibility Score in minutes.',
  keywords: [
    'AI visibility',
    'AI search optimization',
    'ChatGPT business visibility',
    'Google AI Overviews',
    'Gemini business recommendation',
    'Perplexity AI',
    'local AI search',
    'GEO optimization',
  ],
  openGraph: {
    title: 'VisiblyAI — See If AI Recommends Your Business',
    description:
      'Run a free AI Visibility Scan. See how ChatGPT, Gemini, and Google AI rank your business.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
