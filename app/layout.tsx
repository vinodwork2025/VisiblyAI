import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VisiblyAI — See If AI Recommends Your Business',
  description:
    'Discover how visible your business is in Google AI, ChatGPT, Gemini, and Perplexity. Run a free live AI visibility check in under 60 seconds.',
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
    title: 'VisiblyAI — See If AI Recommends Your Business',
    description:
      'Run a free AI visibility check. See how Google AI, ChatGPT, Gemini, and Perplexity rate your business.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
