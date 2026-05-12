import Link from 'next/link'
import { Search, FileText, TrendingUp, AlertCircle, ArrowRight, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-local text-xs font-medium mb-4">
          <Sparkles className="w-3 h-3" />
          CiteCheck AI Trust Dashboard
        </div>
        <h1 className="font-heading font-black text-3xl md:text-4xl mb-2">
          Welcome to CiteCheck
        </h1>
        <p className="text-muted-foreground">
          Run your first AI Trust Check to see how visible and trusted your business is across ChatGPT, Gemini, and more.
        </p>
      </div>

      {/* CTA Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/5 -translate-y-1/3 translate-x-1/3" />
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="font-heading font-black text-xl md:text-2xl mb-2">
                Run your free AI Trust Check
              </h2>
              <p className="text-sm text-muted-foreground max-w-md">
                Discover how trusted and visible your business is across ChatGPT, Google AI Overviews, Gemini,
                and Perplexity. Takes under 60 seconds.
              </p>
            </div>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 teal-glow">
              <Link href="/scan">
                <Search className="w-4 h-4 mr-2" />
                Start New Check
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Checks Run',          value: '0', icon: Search,      sub: 'Run your first check'       },
          { label: 'AI Trust Score',      value: '—', icon: TrendingUp,  sub: 'No data yet'                },
          { label: 'Trust Gaps Detected', value: '—', icon: AlertCircle, sub: 'Complete a check first'     },
          { label: 'Quick Wins',          value: '—', icon: Zap,         sub: 'Actionable improvements'    },
        ].map(({ label, value, icon: Icon, sub }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="font-heading font-black text-2xl mb-1">{value}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        ))}
      </div>

      {/* Two column lower */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent checks */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold">Recent Checks</h3>
            <Link href="/reports" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">No checks yet. Run your first AI Trust Check to see results here.</p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/scan">Run a check</Link>
            </Button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading font-semibold mb-5">Quick Actions</h3>
          <div className="space-y-3">
            {[
              {
                icon: Search,
                label: 'Run AI Trust Check',
                description: 'Analyze your business trust signals across 5 AI platforms',
                href: '/scan',
                primary: true,
              },
              {
                icon: FileText,
                label: 'View Reports',
                description: 'Access your saved check history',
                href: '/reports',
              },
              {
                icon: Sparkles,
                label: 'Request Full Audit',
                description: 'Expert review by OptiScale Advisors',
                href: 'mailto:vinod@optiscale360.com?subject=Full AI Trust Audit Request',
              },
            ].map(({ icon: Icon, label, description, href, primary }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-4 rounded-xl p-4 border transition-colors hover-lift ${
                  primary
                    ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                    : 'border-border hover:bg-muted/30'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${primary ? 'bg-primary/20' : 'bg-secondary'}`}>
                  <Icon className={`w-4 h-4 ${primary ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground truncate">{description}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
