import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Visibly<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              See if AI recommends your business. Powered by OptiScale Advisors.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Run Free Scan', href: '/scan' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'My Reports', href: '/reports' },
                { label: 'Pricing', href: '/#pricing' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'About', href: '/#about' },
                { label: 'OptiScale Advisors', href: 'https://optiscale360.com' },
                { label: 'Contact', href: 'mailto:vinod@optiscale360.com' },
                { label: 'Privacy Policy', href: '/privacy' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'AI Visibility Guide', href: '/#' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'AI Search Blog', href: '/#' },
                { label: 'Case Studies', href: '/#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VisiblyAI · Powered by{' '}
            <Link href="https://optiscale360.com" className="hover:text-foreground transition-colors">
              OptiScale Advisors
            </Link>
          </p>
          <p className="text-xs text-muted-foreground">
            AI visibility data is simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
