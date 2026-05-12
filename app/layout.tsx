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
  title: 'CiteCheck — See If AI Trusts and Recommends Your Business',
  description:
    'Discover how trusted and visible your business is across ChatGPT, Google AI Overviews, Gemini, and AI-powered search. Get your free AI Trust Score in minutes.',
  keywords: [
    'AI citation visibility',
    'AI trust signals',
    'ChatGPT business recommendations',
    'Google AI Overviews',
    'Gemini business visibility',
    'Perplexity AI citations',
    'AI recommendation analysis',
    'local AI search optimization',
    'GEO optimization',
    'AI discoverability',
  ],
  openGraph: {
    title: 'CiteCheck — See If AI Trusts and Recommends Your Business',
    description:
      'Run a free AI Trust Check. See how ChatGPT, Gemini, and Google AI rate your business trust and citation authority.',
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
