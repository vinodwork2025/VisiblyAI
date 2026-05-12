'use client'

export const runtime = 'edge'

import { useEffect, useState, useRef, useId, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  motion, useInView, useMotionValue, useTransform,
  animate, AnimatePresence, type Variants,
} from 'framer-motion'
import {
  Download, Share2, ArrowRight, CheckCircle, AlertTriangle,
  AlertCircle, Zap, ExternalLink, Search, Sparkles,
  TrendingUp, TrendingDown, Minus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScanResult, Insight, Problem, Recommendation, QuickWin } from '@/types'
import {
  OpenAIIcon, GeminiIcon, PerplexityIcon, GoogleAIIcon,
} from '@/components/BrandLogos'

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}
const cardReveal: Variants = {
  hidden:  { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

/* ─────────────────────────────────────────────
   SECTION WRAPPER
───────────────────────────────────────────── */
function Section({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden:  { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   SCORE RING — SVG gauge with Framer Motion
───────────────────────────────────────────── */
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const strokeOffset = useMotionValue(circumference)
  const ref = useRef<SVGCircleElement>(null)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true })
  const displayScore = useMotionValue(0)
  const roundedScore = useTransform(displayScore, Math.round)

  useEffect(() => {
    if (!inView) return
    const targetOffset = circumference - (score / 100) * circumference
    const ctrl1 = animate(strokeOffset, targetOffset, { duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] })
    const ctrl2 = animate(displayScore, score, { duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] })
    return () => { ctrl1.stop(); ctrl2.stop() }
  }, [inView, score, circumference, strokeOffset, displayScore])

  const gradeColor = score >= 80 ? 'oklch(0.72 0.14 177)' : score >= 65 ? 'oklch(0.72 0.14 177)' : score >= 45 ? 'oklch(0.72 0.16 73)' : 'oklch(0.62 0.22 27)'
  const grade = score >= 80 ? 'A' : score >= 65 ? 'B' : score >= 50 ? 'C' : score >= 35 ? 'D' : 'F'
  const uid = useId()
  const gradientId = `gauge-${uid.replace(/:/g, '')}`

  return (
    <div ref={containerRef} className="relative shrink-0" style={{ width: size, height: size }}>
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-full animate-ring-pulse"
        style={{ boxShadow: `0 0 40px ${gradeColor}40, 0 0 80px ${gradeColor}20` }}
      />
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="oklch(0.55 0.18 290)" />
            <stop offset="100%" stopColor="oklch(0.72 0.14 177)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx="50" cy="50" r={radius} stroke="oklch(0.88 0.008 240)" strokeWidth="5.5" className="dark:[stroke:oklch(0.22_0.010_240)]" />
        {/* Animated arc */}
        <motion.circle
          ref={ref}
          cx="50" cy="50" r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: strokeOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span className="font-heading font-black leading-none" style={{ fontSize: size * 0.25, color: gradeColor }}>
          {roundedScore}
        </motion.span>
        <span className="text-xs text-muted-foreground mt-1 font-medium">Grade {grade}</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SCORE BAR — animated width with Framer Motion
───────────────────────────────────────────── */
function ScoreBar({ label, score, delay = 0 }: { label: string; score: number; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const barColor = score >= 65 ? 'bg-primary' : score >= 45 ? 'bg-amber-400' : 'bg-destructive/70'
  const textColor = score >= 65 ? 'text-primary' : score >= 45 ? 'text-amber-500 dark:text-amber-400' : 'severity-critical'

  return (
    <div ref={ref} className="flex items-center gap-3">
      <div className="w-36 text-sm text-muted-foreground shrink-0 leading-tight">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: '0%' }}
          animate={inView ? { width: `${score}%` } : { width: '0%' }}
          transition={{ duration: 1.2, delay: delay / 1000 + 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className={`w-8 text-sm font-heading font-bold text-right shrink-0 ${textColor}`}>{score}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PLATFORM BADGE
───────────────────────────────────────────── */
const PLATFORM_META: Record<string, { label: string; cls: string; icon?: React.ReactNode }> = {
  chatgpt:     { label: 'ChatGPT',    cls: 'badge-chatgpt',    icon: <OpenAIIcon size={11} />    },
  'google-ai': { label: 'Google AI',  cls: 'badge-google',     icon: <GoogleAIIcon size={11} />  },
  gemini:      { label: 'Gemini',     cls: 'badge-gemini',     icon: <GeminiIcon size={11} />    },
  perplexity:  { label: 'Perplexity', cls: 'badge-perplexity', icon: <PerplexityIcon size={10} /> },
  local:       { label: 'Local AI',   cls: 'badge-local'                                          },
}

function PlatformBadge({ platform }: { platform: Insight['platform'] }) {
  const { label, cls, icon } = PLATFORM_META[platform] ?? { label: platform, cls: 'badge-local' }
  return (
    <span className={`${cls} inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium`}>
      {icon}
      {label}
    </span>
  )
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  return (
    <span className={`impact-${impact} text-xs px-2 py-0.5 rounded-md font-medium`}>
      {impact.charAt(0).toUpperCase() + impact.slice(1)} impact
    </span>
  )
}

function EffortBadge({ effort }: { effort: 'easy' | 'medium' | 'hard' }) {
  const label = effort === 'easy' ? 'Easy' : effort === 'medium' ? 'Moderate' : 'Hard'
  return <span className={`effort-${effort} text-xs px-2 py-0.5 rounded-md font-medium`}>{label}</span>
}

function SeverityIcon({ severity }: { severity: Problem['severity'] }) {
  if (severity === 'critical') return <AlertCircle className="w-4 h-4 severity-critical shrink-0" />
  if (severity === 'warning')  return <AlertTriangle className="w-4 h-4 severity-warning shrink-0" />
  return <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0" />
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      <div className="text-xs text-primary font-semibold uppercase tracking-widest mb-1.5">{eyebrow}</div>
      <h3 className="font-heading font-bold text-xl text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN RESULTS COMPONENT
───────────────────────────────────────────── */
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
      try {
        setResult(JSON.parse(raw))
        setLoading(false)
      } catch {
        router.push('/scan')
      }
      return
    }

    // Not in sessionStorage — try DB via API
    fetch(`/api/scans/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: ScanResult | null) => {
        if (data?.id) {
          sessionStorage.setItem(`scan_${data.id}`, JSON.stringify(data))
          setResult(data)
        } else {
          router.push('/scan')
        }
      })
      .catch(() => router.push('/scan'))
      .finally(() => setLoading(false))
  }, [params.id, router])

  if (loading || !result) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your report…</p>
        </div>
      </div>
    )
  }

  const {
    businessName, websiteUrl, city, primaryService,
    overallScore, categories, insights, problems,
    recommendations, quickWins, competitorComparison,
  } = result

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

  const userRank = competitorComparison.findIndex(c => c.isUser) + 1
  const scoreLabel =
    overallScore >= 80 ? 'Excellent' :
    overallScore >= 65 ? 'Good'      :
    overallScore >= 50 ? 'Fair'      :
    overallScore >= 35 ? 'Poor'      : 'Critical'

  const scoreDesc =
    overallScore < 50
      ? `AI platforms currently have insufficient trust signals to recommend ${businessName}. Your competitors are capturing customers who use ChatGPT and Gemini to find ${primaryService} services.`
      : `You have a solid foundation, but specific trust gaps are limiting your AI recommendation rate. Targeted improvements could significantly increase your citation authority.`

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8">

      {/* ── HEADER ── */}
      <Section delay={0}>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="badge-local text-xs px-3 py-1 rounded-full font-semibold">CiteCheck AI Trust Report</span>
              <span className="text-xs text-muted-foreground">{createdDate}</span>
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl mb-2">{businessName}</h1>
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
              >
                {websiteUrl.replace(/^https?:\/\//, '')}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <span className="text-border">·</span>
              <span className="text-sm text-muted-foreground">{city}</span>
              <span className="text-border">·</span>
              <span className="text-sm text-muted-foreground">{primaryService}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-sm">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        </div>
      </Section>

      {/* ── SCORE + CATEGORIES ── */}
      <Section delay={0.05}>
        <div className="grid md:grid-cols-2 gap-5">

          {/* Overall score card */}
          <div className="rounded-2xl border border-border bg-card shadow-card-md p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={overallScore} size={132} />
            <div className="text-center sm:text-left">
              <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">AI Trust Score</div>
              <h2 className="font-heading font-black text-lg leading-tight mb-2">
                {scoreLabel}: {scoreDesc.split('.')[0]}.
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{scoreDesc}</p>
            </div>
          </div>

          {/* Category scores */}
          <div className="rounded-2xl border border-border bg-card shadow-card-md p-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">Score by Category</div>
            <div className="space-y-4">
              {(Object.entries(categories) as [keyof typeof categories, number][]).map(([key, score], i) => (
                <ScoreBar key={key} label={catLabels[key]} score={score} delay={i * 120} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── COMPETITOR COMPARISON ── */}
      <Section delay={0.08}>
        <div className="rounded-2xl border border-border bg-card shadow-card-md p-6">
          <div className="flex items-center justify-between mb-6">
            <SectionLabel eyebrow="Competitive Landscape" title="Competitor Comparison" />
            <span className="badge-local text-xs px-2.5 py-1 rounded-full font-medium shrink-0 self-start">
              #{userRank} of {competitorComparison.length}
            </span>
          </div>

          <motion.div
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
          >
            {competitorComparison.map((comp, i) => {
              const isUser = comp.isUser
              const barWidth = `${comp.score}%`
              return (
                <motion.div
                  key={comp.name}
                  variants={cardReveal}
                  className={`flex items-center gap-4 rounded-xl p-4 border transition-all ${
                    isUser
                      ? 'border-primary/30 bg-primary/5 dark:bg-primary/8'
                      : 'border-border bg-secondary/30 dark:bg-secondary/20'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  <div className={`w-36 text-sm font-medium truncate shrink-0 ${isUser ? 'text-primary' : 'text-foreground'}`}>
                    {comp.name}
                    {isUser && <span className="text-xs text-muted-foreground font-normal ml-1">(you)</span>}
                  </div>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isUser ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                      initial={{ width: '0%' }}
                      whileInView={{ width: barWidth }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1 + 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isUser ? (
                      userRank === 1 ? <TrendingUp className="w-3.5 h-3.5 text-primary" /> :
                      <TrendingDown className="w-3.5 h-3.5 severity-warning" />
                    ) : <Minus className="w-3.5 h-3.5 text-muted-foreground/40" />}
                    <span className={`w-8 text-sm font-heading font-bold text-right ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>
                      {comp.score}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {userRank > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-5 rounded-xl border border-amber-500/20 bg-amber-50/60 dark:bg-amber-500/6 p-4 flex items-start gap-3"
            >
              <AlertTriangle className="w-4 h-4 severity-warning mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="severity-warning font-semibold">Competitors have stronger AI trust signals. </span>
                Businesses outranking you are capturing customers who use ChatGPT and Gemini to find {primaryService} in {city}.
              </p>
            </motion.div>
          )}
        </div>
      </Section>

      {/* ── AI PLATFORM INSIGHTS ── */}
      <Section delay={0.1}>
        <SectionLabel eyebrow="Platform Analysis" title="AI Recommendation Insights" />
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {insights.map((insight) => (
            <motion.div
              key={insight.id}
              variants={cardReveal}
              className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover-lift shadow-card group"
            >
              <div className="flex items-center justify-between">
                <PlatformBadge platform={insight.platform} />
                <ImpactBadge impact={insight.impact} />
              </div>
              <h4 className="text-sm font-semibold leading-snug">{insight.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{insight.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── PROBLEMS ── */}
      <Section delay={0.1}>
        <SectionLabel eyebrow="Issues Detected" title="Trust Gaps Holding You Back" />
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              variants={cardReveal}
              className={`rounded-xl border p-4 bg-severity-${problem.severity} flex items-start gap-3.5`}
            >
              <SeverityIcon severity={problem.severity} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-sm font-semibold">{problem.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-black/5 dark:bg-white/8 text-muted-foreground">{problem.category}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── RECOMMENDATIONS ── */}
      <Section delay={0.1}>
        <SectionLabel eyebrow="Action Plan" title="Recommended Actions" />
        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={stagger}
        >
          {recommendations.map((rec: Recommendation, i: number) => (
            <motion.div
              key={rec.id}
              variants={cardReveal}
              className="rounded-xl border border-border bg-card p-5 hover-lift shadow-card group"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold mb-1.5">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{rec.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <ImpactBadge impact={rec.impact} />
                    <EffortBadge effort={rec.effort} />
                    <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{rec.category}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── QUICK WINS ── */}
      <Section delay={0.1}>
        <SectionLabel
          eyebrow="Start Today"
          title="Quick Wins"
          description="High-impact improvements you can complete right now."
        />
        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <AnimatePresence>
            {quickWins.map((win: QuickWin, idx: number) => {
              const done = quickWinsDone.has(win.id)
              return (
                <motion.div
                  key={win.id}
                  layout
                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-secondary/30 ${
                    idx !== quickWins.length - 1 ? 'border-b border-border' : ''
                  } ${done ? 'opacity-55' : ''}`}
                  onClick={() => toggleQuickWin(win.id)}
                >
                  <motion.div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
                      done ? 'bg-primary border-primary' : 'border-border bg-transparent'
                    }`}
                    animate={done ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.25 }}
                  >
                    <AnimatePresence>
                      {done && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-0.5 transition-all ${done ? 'line-through text-muted-foreground' : ''}`}>
                      {win.title}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{win.description}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-muted-foreground">{win.timeEstimate}</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {quickWinsDone.size > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="text-xs text-primary mt-2 text-right font-medium"
            >
              {quickWinsDone.size}/{quickWins.length} completed ✓
            </motion.p>
          )}
        </AnimatePresence>
      </Section>

      {/* ── FULL AUDIT CTA ── */}
      <Section delay={0.1}>
        <div className="rounded-2xl border border-primary/20 bg-card shadow-card-lg p-8 md:p-10 text-center relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, oklch(0.72 0.14 177 / 12%) 0%, transparent 70%)' }} />
          </div>
          <div className="relative">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
              className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 teal-glow"
            >
              <Sparkles className="w-7 h-7 text-primary" />
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.h3 variants={fadeUp} className="font-heading font-black text-2xl md:text-3xl mb-3">
                Ready to dominate AI search?
              </motion.h3>
              <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
                Get a full AI Trust Audit by the OptiScale Advisors team. We&apos;ll run real AI queries, benchmark
                competitor citation authority, and deliver a complete 90-day action plan to maximize your AI
                recommendation rate.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 font-semibold shadow-primary gap-2"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.62 0.16 177) 0%, oklch(0.52 0.18 200) 100%)',
                    color: 'oklch(1 0 0)',
                  }}
                >
                  <a href="mailto:vinod@optiscale360.com?subject=Full AI Trust Audit Request">
                    Request Full Audit
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 px-6 gap-2">
                  <Link href="/scan">
                    <Search className="w-4 h-4" /> Scan Another Site
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Section>

    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your report…</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
