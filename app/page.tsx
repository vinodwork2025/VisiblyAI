import Link from 'next/link'
import {
  ArrowRight, CheckCircle, Zap, Shield, Target, TrendingUp,
  Search, BarChart2, Star, ChevronDown, Eye, Brain, Globe,
  AlertCircle, Sparkles, Award, Users, Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const platforms = [
  { name: 'ChatGPT',          color: 'badge-chatgpt'    },
  { name: 'Google AI',        color: 'badge-google'     },
  { name: 'Gemini',           color: 'badge-gemini'     },
  { name: 'Perplexity',       color: 'badge-perplexity' },
  { name: 'Local AI Search',  color: 'badge-local'      },
]

const stats = [
  { value: '1,200+', label: 'Businesses checked'               },
  { value: '73%',    label: 'Not trusted by AI platforms'      },
  { value: '5',      label: 'AI platforms analyzed'            },
  { value: '< 60s',  label: 'Check time'                       },
]

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Enter your business info',
    description: 'Provide your business name, website, location, and primary service. Takes under 60 seconds.',
  },
  {
    number: '02',
    icon: Brain,
    title: 'CiteCheck analyzes 5 platforms',
    description: 'Our engine checks your AI trust signals, citation consistency, and recommendation visibility across ChatGPT, Gemini, Google AI, Perplexity, and local AI search.',
  },
  {
    number: '03',
    icon: BarChart2,
    title: 'Get your AI Trust Score',
    description: 'Receive a detailed report with your CiteCheck AI Trust Score, competitive intelligence, and a prioritized action plan to improve your AI recommendation rate.',
  },
]

const features = [
  {
    icon: Globe,
    title: 'Multi-Platform AI Coverage',
    description: 'Analyze your trust and citation signals across every major AI search engine simultaneously — not just Google.',
  },
  {
    icon: Users,
    title: 'Competitor Intelligence',
    description: 'See exactly how your AI recommendation visibility compares to competitors. Understand where they outperform you and why.',
  },
  {
    icon: Zap,
    title: 'Instant AI Trust Score',
    description: 'Get your CiteCheck AI Trust Score across 5 trust categories with one click. See your overall recommendation readiness at a glance.',
  },
  {
    icon: Target,
    title: 'Strategic Recommendations',
    description: 'Prioritized, business-friendly actions — not vague advice. Each recommendation is rated by impact and effort required.',
  },
  {
    icon: Clock,
    title: 'Quick Wins Checklist',
    description: 'Improve your AI trust today with curated high-impact actions you can complete in under an hour.',
  },
  {
    icon: Award,
    title: 'Full Audit Ready',
    description: 'Your check results serve as the foundation for a full AI Trust Audit by our expert team at OptiScale Advisors.',
  },
]

const testimonials = [
  {
    quote: "I had no idea my competitors were so much more trusted by ChatGPT. CiteCheck showed me exactly what to fix — and we saw real results within weeks.",
    name: 'Sarah M.',
    role: 'Owner, Precision Dental',
    initial: 'S',
  },
  {
    quote: "The check took 60 seconds and gave us more actionable insight than 3 months of guessing. The competitor comparison alone was worth it.",
    name: 'James R.',
    role: 'Marketing Director, Apex Roofing',
    initial: 'J',
  },
  {
    quote: "I never thought about AI citation visibility before. Now it's one of our top priorities. CiteCheck made the problem — and the solution — crystal clear.",
    name: 'Priya K.',
    role: 'CEO, Bloom Wellness Spa',
    initial: 'P',
  },
]

const faqs = [
  {
    q: 'What is AI citation visibility?',
    a: "AI citation visibility refers to how often and how prominently your business is trusted and recommended when AI systems like ChatGPT, Gemini, Google AI Overviews, and Perplexity generate answers to customer queries. As more people use AI assistants to find local businesses, AI citation visibility is becoming as important as traditional SEO.",
  },
  {
    q: 'How does CiteCheck work?',
    a: "CiteCheck fetches live data from your website — including robots.txt, llms.txt, structured schema data, and content signals. We analyze whether AI crawlers can access your site, whether you have the trust signals AI platforms require, and how your authority compares to competitors. You get a real-data AI Trust Score and a clear action plan.",
  },
  {
    q: 'How accurate is the AI Trust Score?',
    a: "The score is based on real technical signals fetched from your live website: AI crawler access, llms.txt, schema markup, FAQ content, HTTPS, and sitemap presence. These are the foundational factors that determine whether AI platforms can discover and trust your business. For in-depth AI query testing and full citation benchmarking, we offer a Full AI Trust Audit.",
  },
  {
    q: 'Do I need technical knowledge?',
    a: "Zero technical knowledge required. Your report is written in plain business language, and every recommendation includes a clear explanation of what to do and why it matters for your AI recommendation rate.",
  },
  {
    q: 'How is this different from regular SEO?',
    a: "Traditional SEO optimizes for search engine crawlers and ranking algorithms. AI trust optimization focuses on the signals AI language models use to select businesses for recommendations — citation consistency, authority signals, llms.txt presence, structured data, and conversational content relevance.",
  },
  {
    q: 'What happens after the check?',
    a: "You receive a full CiteCheck AI Trust Report with your score, competitor comparison, detected trust gaps, and prioritized recommendations. You can implement quick wins yourself or engage our team for a Full AI Trust Audit with real AI query testing and a 90-day action plan.",
  },
]

function DashboardPreview() {
  return (
    <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border glass-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-muted-foreground mb-1">CiteCheck AI Trust Report</div>
          <div className="font-heading font-bold text-lg">Apex Roofing Co. · Dallas, TX</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-heading font-black gradient-text">54</div>
          <div className="text-xs text-muted-foreground">AI Trust Score</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { label: 'AI Rec. Visibility',       score: 42 },
          { label: 'Local Authority',           score: 61 },
          { label: 'Citation Trust Signals',    score: 55 },
          { label: 'Content Coverage',          score: 38 },
          { label: 'Technical Trust Readiness', score: 74 },
        ].map(({ label, score }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-40 text-xs text-muted-foreground shrink-0">{label}</div>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-primary opacity-80" style={{ width: `${score}%` }} />
            </div>
            <div className="w-8 text-xs text-right text-muted-foreground">{score}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-5">
        <div className="text-xs text-muted-foreground mb-3">AI Recommendation Comparison</div>
        <div className="space-y-2">
          {[
            { name: 'Dallas Roofing Pros', score: 78, isTop: true },
            { name: 'Apex Roofing Co.',    score: 54, isUser: true },
            { name: 'Texas Roof Masters',  score: 46 },
          ].map(({ name, score, isUser, isTop }) => (
            <div key={name} className="flex items-center gap-3">
              <div className={`w-36 text-xs truncate ${isUser ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{name}</div>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full ${isUser ? 'bg-primary' : isTop ? 'bg-chart-3' : 'bg-muted-foreground/40'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="w-7 text-xs text-right text-muted-foreground">{score}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-4">
        <Link href="/scan">
          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 teal-glow">
            See your actual results →
          </Button>
        </Link>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-border rounded-xl overflow-hidden">
      <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-muted/30 transition-colors">
        <span className="text-sm font-medium">{q}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform duration-200" />
      </summary>
      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>
    </details>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 mesh-bg overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium badge-local mb-8">
            <Sparkles className="w-3 h-3" />
            AI Citation & Trust Intelligence · Powered by OptiScale Advisors
          </span>
        </div>

        <h1 className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight max-w-5xl animate-fade-up delay-100">
          See if AI{' '}
          <span className="gradient-text">trusts and recommends</span>
          <br />
          your business.
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed animate-fade-up delay-200">
          Discover how visible and trustworthy your business appears across ChatGPT, Google AI Overviews, Gemini,
          and AI-powered search systems — before your competitors get there first.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-up delay-300">
          <Button
            size="lg"
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-semibold teal-glow"
          >
            <Link href="/scan">
              Run Free AI Visibility Check
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base">
            <Link href="#preview">View Sample Report</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-10 animate-fade-up delay-400">
          {platforms.map(p => (
            <span key={p.name} className={`${p.color} text-xs px-3 py-1 rounded-full font-medium`}>
              {p.name}
            </span>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-heading font-black text-3xl md:text-4xl gradient-text mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="badge-local mb-6 font-medium border-0">The AI Search Shift</Badge>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-tight mb-6">
                Your competitors are becoming more trusted by AI.{' '}
                <span className="gradient-text">Are you?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Millions of customers now use ChatGPT, Gemini, and Google AI Overviews to find local services.
                These AI systems recommend businesses based on trust signals and citation authority most business owners don&apos;t know exist.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                If your business lacks the right AI trust signals, you&apos;re invisible to a growing
                segment of your market — even if your traditional SEO is perfect.
              </p>
              <ul className="space-y-3">
                {[
                  '73% of businesses are not trusted enough to appear in AI recommendations',
                  'AI search usage growing 40% month-over-month',
                  'Businesses recommended by AI see 2–3x more inquiries',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="text-sm font-medium text-muted-foreground mb-4">AI Recommendation Trust Snapshot</div>
                {[
                  { name: 'Top Competitor',   score: 78, status: 'Trusted & recommended by ChatGPT',   good: true  },
                  { name: 'Your Business',    score: 31, status: 'Not trusted — missing from AI results', good: false },
                  { name: 'Other Competitor', score: 62, status: 'Cited in Gemini results',               good: true  },
                ].map(({ name, score, status, good }) => (
                  <div key={name} className={`rounded-xl p-4 border ${good ? 'border-border bg-secondary/30' : 'bg-severity-critical border-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{name}</span>
                      <span className={`text-2xl font-heading font-black ${good ? 'text-primary' : 'severity-critical'}`}>{score}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${good ? 'bg-primary' : 'bg-destructive/60'}`} style={{ width: `${score}%` }} />
                    </div>
                    <span className={`text-xs ${good ? 'text-muted-foreground' : 'severity-critical'}`}>{status}</span>
                  </div>
                ))}
              </div>
              <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary animate-glow-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="badge-local mb-4 font-medium border-0">Simple Process</Badge>
            <h2 className="font-heading font-black text-4xl md:text-5xl">How CiteCheck works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="rounded-2xl border border-border bg-background p-8 hover-lift">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-black text-4xl text-primary/20">{number}</span>
                </div>
                <h3 className="font-heading font-bold text-lg mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="badge-local mb-4 font-medium border-0">Everything you need</Badge>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">Your complete AI trust intelligence picture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              One check. Every AI platform. A clear path to becoming the business AI trusts and recommends.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 hover-lift">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="preview" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="badge-local mb-4 font-medium border-0">Live Report Preview</Badge>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">What your AI Trust Report looks like</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A real-data snapshot of your AI trust and citation authority across 5 dimensions — with competitor benchmarking.
            </p>
          </div>
          <DashboardPreview />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="badge-local mb-4 font-medium border-0">Results</Badge>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Businesses that got trusted by AI</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ quote, name, role, initial }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t border-border pt-5">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {initial}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="badge-local mb-4 font-medium border-0">Questions</Badge>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(faq => <FaqItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 mesh-bg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(oklch(1 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-8 teal-glow">
            <Eye className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-heading font-black text-5xl md:text-6xl leading-tight mb-6">
            Start getting trusted<br />
            <span className="gradient-text">by AI search today.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Your free AI Trust Check takes under 60 seconds. No credit card. No commitment.
            Just clarity on where you stand — and what to fix.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-10 text-lg font-semibold teal-glow"
          >
            <Link href="/scan">
              Run My Free AI Check
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-6 mt-6">
            {['Free check', 'No credit card', 'Instant results'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="w-3.5 h-3.5 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
