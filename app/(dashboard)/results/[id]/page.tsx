'use client'

export const runtime = 'edge'

import { useEffect, useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Download, Share2, ArrowRight, CheckCircle, AlertTriangle,
  AlertCircle, Zap, ExternalLink, ChevronRight, Sparkles,
  MessageSquare, Search, Globe, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ScanResult, Insight, Problem, Recommendation, QuickWin } from '@/types'

/* ── Score Ring ── */
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(false)
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animated ? score / 100 : 0) * circumference

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200)
    return () => clearTimeout(t)
  }, [])

  const color = score >= 65 ? '#00D9B8' : score >= 45 ? '#F59E0B' : '#EF4444'
  const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r={radius} stroke="oklch(1 0 0 / 8%)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius}
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-heading font-black text-4xl leading-none" style={{ color }}>
          {score}
        </div>
        <div className="text-xs text-muted-foreground mt-1">Grade {grade}</div>
      </div>
    </div>
  )
}

/* ── Score Bar ── */
function ScoreBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), delay + 400)
    return () => clearTimeout(t)
  }, [delay])

  const color = score >= 65 ? 'bg-primary' : score >= 45 ? 'bg-amber-accent' : 'bg-destructive/70'

  return (
    <div className="flex items-center gap-4">
      <div className="w-36 text-sm text-muted-foreground shrink-0">{label}</div>
      <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: animated ? `${score}%` : '0%', transitionDelay: `${delay}ms` }}
        />
      </div>
      <div className={`w-10 text-sm font-heading font-bold text-right ${
        score >= 65 ? 'text-primary' : score >= 45 ? 'text-amber-accent' : 'severity-critical'
      }`}>{score}</div>
    </div>
  )
}

/* ── Platform icon ── */
function PlatformBadge({ platform }: { platform: Insight['platform'] }) {
  const map: Record<string, { label: string; cls: string }> = {
    chatgpt:     { label: 'ChatGPT',     cls: 'badge-chatgpt'   },
    'google-ai': { label: 'Google AI',   cls: 'badge-google'    },
    gemini:      { label: 'Gemini',      cls: 'badge-gemini'    },
    perplexity:  { label: 'Perplexity',  cls: 'badge-perplexity'},
    local:       { label: 'Local AI',    cls: 'badge-local'     },
  }
  const { label, cls } = map[platform] ?? { label: platform, cls: 'badge-local' }
  return <span className={`${cls} text-xs px-2.5 py-1 rounded-full font-medium`}>{label}</span>
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  return (
    <span className={`impact-${impact} text-xs px-2 py-0.5 rounded-md font-medium`}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)} impact
    </span>
  )
}

function EffortBadge({ effort }: { effort: 'easy' | 'medium' | 'hard' }) {
  const label = effort === 'easy' ? 'Easy' : effort === 'medium' ? 'Moderate effort' : 'Hard'
  return <span className={`effort-${effort} text-xs px-2 py-0.5 rounded-md font-medium`}>{label}</span>
}

/* ── Severity icon ── */
function SeverityIcon({ severity }: { severity: Problem['severity'] }) {
  if (severity === 'critical') return <AlertCircle className="w-4 h-4 severity-critical" />
  if (severity === 'warning')  return <AlertTriangle className="w-4 h-4 severity-warning" />
  return <AlertCircle className="w-4 h-4 text-muted-foreground" />
}

/* ── Main Results Component ── */
function ResultsContent() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [quickWinsDone, setQuickWinsDone] = useState<Set<string>>(new Set())

  useEffect(() => {
    const id = params.id as string
    if (!id) { router.push('/scan'); return }
    const raw = sessionStorage.getItem(`scan_${id}`)
    if (raw) {
      try { setResult(JSON.parse(raw)) } catch { router.push('/scan') }
    } else {
      router.push('/scan')
    }
    setLoading(false)
  }, [params.id, router])

  if (loading || !result) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const { businessName, websiteUrl, city, primaryService, overallScore, categories,
          insights, problems, recommendations, quickWins, competitorComparison } = result

  function toggleQuickWin(id: string) {
    setQuickWinsDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const catLabels: Record<keyof typeof categories, string> = {
    aiRecommendationVisibility: 'AI Recommendation Visibility',
    localAuthority:             'Local Authority',
    citationTrustSignals:       'Citation Trust Signals',
    contentCoverage:            'Content Coverage',
    technicalTrustReadiness:    'Technical Trust Readiness',
  }

  const createdDate = new Date(result.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-local text-xs px-2.5 py-1 rounded-full font-medium">CiteCheck AI Trust Report</span>
            <span className="text-xs text-muted-foreground">{createdDate}</span>
          </div>
          <h1 className="font-heading font-black text-2xl md:text-3xl">{businessName}</h1>
          <div className="flex items-center gap-2 mt-1">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
              {websiteUrl.replace(/^https?:\/\//, '')} <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm text-muted-foreground">{city}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm text-muted-foreground">{primaryService}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* ── SCORE + CATEGORIES ── */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Overall score */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0 animate-count-up">
            <ScoreRing score={overallScore} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">CiteCheck AI Trust Score</div>
            <h2 className="font-heading font-black text-xl mb-2">
              {overallScore < 35 ? 'Critical: AI platforms do not trust your business'  :
               overallScore < 50 ? 'Poor: Low AI trust and recommendation readiness'    :
               overallScore < 65 ? 'Fair: Moderate AI trust — gaps remain'             :
               overallScore < 80 ? 'Good: Solid AI trust signals'                      :
               'Excellent: Strong AI trust and recommendation authority'}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {overallScore < 50
                ? `Your business lacks the trust signals AI platforms require to recommend you. Competitors are capturing the customers who use ChatGPT and Gemini to find ${primaryService} services in ${city}.`
                : `Your business has a solid foundation but specific trust gaps are limiting your AI recommendation rate. Targeted improvements could significantly increase your citation authority.`
              }
            </p>
          </div>
        </div>

        {/* Category scores */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-5">Score by Category</div>
          <div className="space-y-4">
            {(Object.entries(categories) as [keyof typeof categories, number][]).map(([key, score], i) => (
              <ScoreBar key={key} label={catLabels[key]} score={score} delay={i * 100} />
            ))}
          </div>
        </div>
      </div>

      {/* ── COMPETITOR COMPARISON ── */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Competitive Landscape</div>
            <h3 className="font-heading font-semibold text-lg">Competitor Comparison</h3>
          </div>
          <Badge className="badge-local border-0 text-xs">
            {competitorComparison.findIndex(c => c.isUser) + 1} of {competitorComparison.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {competitorComparison.map((comp, i) => (
            <div key={comp.name} className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${
              comp.isUser ? 'border-primary/25 bg-primary/5' : 'border-border bg-secondary/30'
            }`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-secondary shrink-0">
                {i + 1}
              </div>
              <div className={`w-40 text-sm font-medium truncate ${comp.isUser ? 'text-primary' : ''}`}>
                {comp.name}
                {comp.isUser && <span className="text-xs text-muted-foreground font-normal ml-1">(you)</span>}
              </div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${comp.isUser ? 'bg-primary' : 'bg-muted-foreground/50'}`}
                  style={{ width: `${comp.score}%` }}
                />
              </div>
              <div className={`w-10 text-right font-heading font-bold text-sm ${comp.isUser ? 'text-primary' : 'text-muted-foreground'}`}>
                {comp.score}
              </div>
            </div>
          ))}
        </div>
        {competitorComparison.findIndex(c => c.isUser) > 0 && (
          <div className="mt-4 rounded-xl border border-amber-accent/20 bg-severity-warning p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 severity-warning mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              <span className="severity-warning font-medium">Your competitors have stronger AI trust signals. </span>
              Businesses outranking you in AI recommendation trust are capturing customers who use ChatGPT and Gemini to find {primaryService} in {city}.
            </p>
          </div>
        )}
      </div>

      {/* ── AI PLATFORM INSIGHTS ── */}
      <div>
        <div className="mb-4">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Platform Analysis</div>
          <h3 className="font-heading font-semibold text-lg">AI Recommendation Insights</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map(insight => (
            <div key={insight.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover-lift">
              <div className="flex items-center justify-between">
                <PlatformBadge platform={insight.platform} />
                <ImpactBadge impact={insight.impact} />
              </div>
              <h4 className="text-sm font-semibold">{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEMS ── */}
      <div>
        <div className="mb-4">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Issues Detected</div>
          <h3 className="font-heading font-semibold text-lg">Trust Gaps Holding You Back</h3>
        </div>
        <div className="space-y-3">
          {problems.map(problem => (
            <div key={problem.id} className={`rounded-xl border p-4 bg-severity-${problem.severity} flex items-start gap-4`}>
              <SeverityIcon severity={problem.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold">{problem.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground`}>{problem.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECOMMENDATIONS ── */}
      <div>
        <div className="mb-4">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Action Plan</div>
          <h3 className="font-heading font-semibold text-lg">Recommended Actions</h3>
        </div>
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={rec.id} className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="text-sm font-semibold">{rec.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ImpactBadge impact={rec.impact} />
                    <EffortBadge effort={rec.effort} />
                    <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{rec.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK WINS ── */}
      <div>
        <div className="mb-4">
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Start Today</div>
          <h3 className="font-heading font-semibold text-lg">Quick Wins</h3>
          <p className="text-sm text-muted-foreground mt-1">High-impact improvements you can complete right now.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
          {quickWins.map((win) => {
            const done = quickWinsDone.has(win.id)
            return (
              <div
                key={win.id}
                className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-muted/20 ${done ? 'opacity-60' : ''}`}
                onClick={() => toggleQuickWin(win.id)}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all ${
                  done ? 'bg-primary border-primary' : 'border-border'
                }`}>
                  {done && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium mb-0.5 ${done ? 'line-through text-muted-foreground' : ''}`}>
                    {win.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{win.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">{win.timeEstimate}</span>
                </div>
              </div>
            )
          })}
        </div>
        {quickWinsDone.size > 0 && (
          <p className="text-xs text-primary mt-2 text-right">
            {quickWinsDone.size}/{quickWins.length} completed ✓
          </p>
        )}
      </div>

      {/* ── FULL AUDIT CTA ── */}
      <div className="rounded-2xl border border-primary/20 mesh-bg p-8 text-center relative overflow-hidden">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5 teal-glow">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading font-black text-xl md:text-2xl mb-3">
            Ready to dominate AI search?
          </h3>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed">
            Get a full AI Trust Audit by the OptiScale Advisors team. We&apos;ll run real
            AI queries, benchmark your competitors&apos; citation authority, and deliver a complete 90-day action plan
            to maximize your AI recommendation rate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 font-semibold teal-glow"
            >
              <a href="mailto:vinod@optiscale360.com?subject=Full AI Trust Audit Request">
                Request Full Audit
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/scan">
                <Search className="mr-2 w-4 h-4" /> Run Another Scan
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
