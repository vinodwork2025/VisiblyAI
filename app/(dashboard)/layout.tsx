import Link from 'next/link'
import { Zap, LayoutDashboard, Search, FileText, Settings, Sparkles } from 'lucide-react'

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard'  },
  { href: '/scan',      icon: Search,          label: 'New Check'  },
  { href: '/reports',   icon: FileText,         label: 'My Reports' },
  { href: '/settings',  icon: Settings,         label: 'Settings'   },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-sidebar shrink-0 fixed top-0 left-0 h-full z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-base">
              Cite<span className="text-primary">Check</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3">
          <div className="space-y-1">
            {nav.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors group"
              >
                <Icon className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Upgrade CTA */}
        <div className="p-4 border-t border-border">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">Full Audit</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Get a complete AI trust and citation audit by our expert team.
            </p>
            <a
              href="mailto:vinod@optiscale360.com?subject=Full AI Trust Audit Request"
              className="block text-center text-xs font-semibold bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors"
            >
              Request Audit →
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm">Cite<span className="text-primary">Check</span></span>
        </Link>
        <nav className="flex items-center gap-1">
          {nav.slice(0, 3).map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60 min-h-screen pt-14 md:pt-0">
        {children}
      </main>
    </div>
  )
}
