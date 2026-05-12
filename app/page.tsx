'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Zap, Target,
  Search, BarChart2, ChevronDown, Eye, Brain, Globe,
  AlertCircle, Sparkles, Award, Users, Clock,
  Shield, TrendingUp, Star, Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ── Animation variants ── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
}
const staggerSlow: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ── Section wrapper with scroll trigger ── */
function Section({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Stagger grid ── */
function StaggerGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  )
}

/* ── Animated counter ── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="font-heading font-black text-3xl md:text-4xl gradient-text mb-1 tabular-nums"
        initial={{ scale: 0.7 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1], delay: 0.1 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  )
}

/* ── Platform badge ── */
function PlatformChip({ name, color }: { name: string; color: string }) {
  return (
    <motion.span
      variants={fadeIn}
      className={`${color} text-xs px-3.5 py-1.5 rounded-full font-semibold tracking-tight`}
    >
      {name}
    </motion.span>
  )
}

/* ── Feature card ── */
function FeatureCard({ icon: Icon, title, description, index }: { icon: React.ElementType; title: string; description: string; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative rounded-2xl border border-border bg-card p-7 hover-lift shadow-card"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-heading font-bold text-base mb-2.5 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </motion.div>
  )
}

/* ── Step card ── */
function StepCard({ number, icon: Icon, title, description }: { number: string; icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative rounded-2xl border border-border bg-card p-8 shadow-card hover-lift"
    >
      <div className="flex items-start gap-5 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-heading font-black text-5xl text-primary/10 leading-none mt-1">{number}</span>
      </div>
      <h3 className="font-heading font-bold text-lg mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

/* ── Testimonial ── */
function TestimonialCard({ quote, name, role, initial }: { quote: string; name: string; role: string; initial: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-border bg-card p-7 flex flex-col shadow-card hover-lift"
    >
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-sm text-foreground/75 leading-relaxed flex-1 mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 border-t border-border pt-5">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
          {initial}
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">{name}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── FAQ item ── */
function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <motion.details
      variants={fadeUp}
      className="group border border-border rounded-xl overflow-hidden bg-card shadow-card"
    >
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none hover:bg-secondary/50 transition-colors">
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform duration-300" />
      </summary>
      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>
    </motion.details>
  )
}

/* ── Dashboard preview ── */
function ReportPreview() {
  const categories = [
    { label: 'AI Rec. Visibility',       score: 42, color: 'bg-rose-400'   },
    { label: 'Local Authority',           score: 61, color: 'bg-primary'    },
    { label: 'Citation Trust Signals',    score: 55, color: 'bg-primary'    },
    { label: 'Content Coverage',          score: 38, color: 'bg-amber-400'  },
    { label: 'Technical Trust Readiness', score: 74, color: 'bg-primary'    },
  ]
  const competitors = [
    { name: 'Dallas Roofing Pros', score: 78, isTop: true  },
    { name: 'Apex Roofing Co.',    score: 54, isUser: true  },
    { name: 'Texas Roof Masters',  score: 46               },
  ]
  return (
    <motion.div
      variants={fadeUp}
      className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border bg-card shadow-card-lg p-7 md:p-9"
    >
      {/* Report header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> CiteCheck AI Trust Report
          </div>
          <div className="font-heading font-bold text-xl text-foreground">Apex Roofing Co.</div>
          <div className="text-sm text-muted-foreground">Dallas, TX · Roofing</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-heading font-black gradient-text leading-none">54</div>
          <div className="text-xs text-muted-foreground mt-1">AI Trust Score</div>
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-3.5 mb-7">
        {categories.map(({ label, score, color }, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-44 text-xs text-muted-foreground shrink-0 font-medium">{label}</div>
            <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${score}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="w-8 text-xs text-right text-muted-foreground font-semibold tabular-nums">{score}</div>
          </div>
        ))}
      </div>

      {/* Competitor comparison */}
      <div className="border-t border-border pt-6">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">AI Recommendation Comparison</div>
        <div className="space-y-2.5">
          {competitors.map(({ name, score, isUser, isTop }) => (
            <div key={name} className="flex items-center gap-3">
              <div className={`w-40 text-xs truncate font-medium ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>{name}</div>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isUser ? 'bg-primary' : isTop ? 'bg-emerald-400' : 'bg-muted-foreground/35'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className={`w-8 text-xs text-right font-heading font-bold tabular-nums ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>{score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Fade-out CTA */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card via-card/90 to-transparent flex items-end justify-center pb-5">
        <Link href="/scan">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary gap-2 font-semibold">
            See your real results <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const platforms = [
  { name: 'ChatGPT',          color: 'badge-chatgpt'    },
  { name: 'Google AI',        color: 'badge-google'     },
  { name: 'Gemini',           color: 'badge-gemini'     },
  { name: 'Perplexity',       color: 'badge-perplexity' },
  { name: 'Local AI Search',  color: 'badge-local'      },
]

const stats = [
  { value: '1,200+', label: 'Businesses analyzed'            },
  { value: '73%',    label: 'Missing from AI recommendations' },
  { value: '5',      label: 'AI platforms covered'           },
  { value: '< 60s',  label: 'Time to your Trust Score'       },
]

const steps = [
  {
    number: '01', icon: Search,
    title: 'Enter your business details',
    description: 'Provide your business name, website, city, and primary service. Takes under 60 seconds — no credit card needed.',
  },
  {
    number: '02', icon: Brain,
    title: 'CiteCheck fetches live data',
    description: 'Our engine reads your website in real time — robots.txt, llms.txt, schema markup, and content signals — to analyze your actual AI trust posture.',
  },
  {
    number: '03', icon: BarChart2,
    title: 'Get your CiteCheck AI Trust Score',
    description: 'Receive a full report with your AI Trust Score, competitor benchmarking, detected trust gaps, and a prioritized action plan.',
  },
]

const features = [
  { icon: Globe,      title: 'Multi-Platform AI Coverage',    description: 'Check AI trust signals across ChatGPT, Google AI Overviews, Gemini, Perplexity, and local AI search — simultaneously.' },
  { icon: Users,      title: 'Live Competitor Intelligence',  description: 'We fetch and score your competitors\' sites in real time. See their actual trust signals vs. yours — no guessing.' },
  { icon: Zap,        title: 'Instant AI Trust Score',        description: 'Your CiteCheck AI Trust Score across 5 categories — AI Recommendation Visibility, Citation Trust Signals, Local Authority, Content Coverage, and Technical Trust Readiness.' },
  { icon: Target,     title: 'Strategic Recommendations',     description: 'Specific, business-friendly actions ranked by impact and effort. Built from your actual site data, not templates.' },
  { icon: Clock,      title: 'Quick Wins Checklist',          description: 'Improve AI trust today with high-impact actions — some completable in under 15 minutes — surfaced from your live scan.' },
  { icon: Award,      title: 'Full Audit Ready',              description: 'Your CiteCheck report becomes the foundation for a full AI Trust Audit by our OptiScale Advisors expert team.' },
]

const testimonials = [
  {
    quote: "I had no idea my competitors had stronger AI trust signals. CiteCheck showed me exactly what was blocking me — and we saw real results within weeks.",
    name: 'Sarah M.', role: 'Owner, Precision Dental', initial: 'S',
  },
  {
    quote: "The check took 60 seconds and gave us more actionable insight than 3 months of guessing. The competitor comparison alone changed how we think about digital.",
    name: 'James R.', role: 'Marketing Director, Apex Roofing', initial: 'J',
  },
  {
    quote: "I never thought about AI citation visibility before. Now it's one of our top priorities. CiteCheck made the problem — and the solution — immediately clear.",
    name: 'Priya K.', role: 'CEO, Bloom Wellness Spa', initial: 'P',
  },
]

const faqs = [
  {
    q: 'What is AI citation visibility?',
    a: "AI citation visibility is how often and how prominently your business is trusted and recommended when AI systems like ChatGPT, Gemini, Google AI Overviews, and Perplexity generate answers to customer queries. As more people use AI assistants to find local services, AI citation authority is becoming as important as traditional SEO.",
  },
  {
    q: 'How does CiteCheck work?',
    a: "CiteCheck fetches live data directly from your website — including robots.txt, llms.txt, JSON-LD schema, FAQ content, and technical signals. We analyze whether AI crawlers can access your site, whether you have the trust and authority signals AI platforms require, and how your posture compares to competitors. You get a real-data AI Trust Score and clear action plan.",
  },
  {
    q: 'How accurate is the AI Trust Score?',
    a: "The score is based on real technical signals from your live website: AI crawler access (GPTBot, ClaudeBot, PerplexityBot), llms.txt presence, schema markup, FAQ content, HTTPS, and sitemap. These are the foundational factors that determine whether AI platforms can discover and trust your business. For deep AI query testing, we offer a Full AI Trust Audit.",
  },
  {
    q: 'Do I need technical knowledge?',
    a: "Zero technical knowledge required. Your report is written in plain business language, and every recommendation includes a clear explanation of what to do and why it matters for your AI recommendation rate.",
  },
  {
    q: 'How is this different from regular SEO?',
    a: "Traditional SEO optimizes for search engine ranking algorithms. AI trust optimization focuses on the signals language models use to select businesses for recommendations — citation consistency, authority indicators, llms.txt, structured data, and conversational content. Different systems, different signals.",
  },
  {
    q: 'What do I get after the check?',
    a: "A full CiteCheck AI Trust Report: your score across 5 categories, live competitor comparison, detected trust gaps with severity ratings, and a prioritized action plan. You can implement quick wins yourself or engage our team for a Full AI Trust Audit with 90-day roadmap.",
  },
]

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 mesh-bg overflow-hidden">
        {/* Dot grid overlay */}
        <div className="absolute inset-0 dot-grid opacity-[0.35] pointer-events-none" />

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold badge-local mb-8 shadow-card">
            <Sparkles className="w-3.5 h-3.5" />
            AI Citation & Trust Intelligence · Powered by OptiScale Advisors
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[0.93] tracking-tight max-w-5xl mb-6"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          See if AI{' '}
          <span className="gradient-text">trusts and recommends</span>
          <br className="hidden sm:block" />
          {' '}your business.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          Discover how visible and trustworthy your business appears across ChatGPT, Google AI Overviews,
          Gemini, and AI-powered search — before your competitors get there first.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            size="lg"
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-13 px-9 text-base font-semibold shadow-primary gap-2 rounded-xl"
          >
            <Link href="/scan">
              Run Free AI Visibility Check
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="h-13 px-8 text-base border-border bg-card/80 hover:bg-card shadow-card rounded-xl"
          >
            <Link href="#preview">View Sample Report</Link>
          </Button>
        </motion.div>

        {/* Platform chips */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mb-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
        >
          {platforms.map(p => <PlatformChip key={p.name} {...p} />)}
        </motion.div>

        {/* Trust line */}
        <motion.div
          className="flex items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {['No credit card', 'Results in 60s', 'Live site data'].map(item => (
            <div key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              {item}
            </div>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => <AnimatedStat key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <Section>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-6">
                The AI Search Shift
              </div>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-[1.05] mb-6">
                Your competitors are becoming more trusted by AI.{' '}
                <span className="gradient-text">Are you?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5 text-base">
                Millions of customers now use ChatGPT, Gemini, and Google AI Overviews to find local services.
                These AI systems recommend businesses based on trust and citation signals most business owners don&apos;t know exist.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                If your business lacks the right AI trust signals, you&apos;re invisible to a growing segment
                of your market — even if your traditional SEO is perfect.
              </p>
              <ul className="space-y-3.5">
                {[
                  '73% of businesses are missing from AI recommendations entirely',
                  'AI search intent growing 40% month-over-month',
                  'Businesses recommended by AI see 2–3× more qualified inquiries',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertCircle className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section delay={0.15}>
              <div className="rounded-2xl border border-border bg-card shadow-card-md p-6 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">AI Recommendation Trust Snapshot</div>
                {[
                  { name: 'Top Competitor',   score: 78, status: 'Trusted & cited by ChatGPT',      good: true  },
                  { name: 'Your Business',    score: 31, status: 'Missing from AI results',          good: false },
                  { name: 'Other Competitor', score: 62, status: 'Appears in Gemini answers',        good: true  },
                ].map(({ name, score, status, good }) => (
                  <div key={name} className={`rounded-xl p-4 border ${good ? 'border-border bg-secondary/40' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-foreground">{name}</span>
                      <span className={`text-2xl font-heading font-black ${good ? 'text-primary' : 'text-rose-500'}`}>{score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2.5">
                      <div className={`h-full rounded-full ${good ? 'bg-primary' : 'bg-rose-400'}`} style={{ width: `${score}%` }} />
                    </div>
                    <span className={`text-xs font-medium ${good ? 'text-muted-foreground' : 'text-rose-600'}`}>{status}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">
              Simple Process
            </div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">How CiteCheck works</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Real data from your live website. Not templates, not estimates. Your actual AI trust posture.
            </p>
          </Section>
          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {steps.map(s => <StepCard key={s.number} {...s} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* ── TRUST SIGNALS EXPLAINER ── */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <Section delay={0.1}>
              <div className="rounded-2xl border border-border bg-card shadow-card-md p-7 space-y-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">What CiteCheck checks on your live site</div>
                {[
                  { icon: Lock,       label: 'AI Crawler Access',     sub: 'GPTBot, ClaudeBot, PerplexityBot access in robots.txt',     ok: false },
                  { icon: Globe,      label: 'llms.txt File',          sub: 'AI-readable business description file at /llms.txt',        ok: false },
                  { icon: BarChart2,  label: 'Schema Markup',          sub: 'JSON-LD structured data: LocalBusiness, FAQPage, Review',   ok: true  },
                  { icon: Shield,     label: 'HTTPS & Sitemap',        sub: 'Technical trust baseline signals',                          ok: true  },
                  { icon: TrendingUp, label: 'FAQ & Content Signals',  sub: 'Conversational content AI can extract and cite',            ok: false },
                ].map(({ icon: Icon, label, sub, ok }) => (
                  <div key={label} className={`flex items-start gap-4 rounded-xl p-4 border ${ok ? 'border-border bg-secondary/30' : 'bg-rose-50 border-rose-200'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ok ? 'bg-primary/10 border border-primary/20' : 'bg-rose-100 border-rose-200'}`}>
                      <Icon className={`w-4 h-4 ${ok ? 'text-primary' : 'text-rose-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ok ? 'bg-primary/10 text-primary' : 'bg-rose-100 text-rose-600'}`}>
                          {ok ? 'OK' : 'Issue'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-6">
                What We Analyze
              </div>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-[1.05] mb-6">
                How AI platforms choose which businesses to{' '}
                <span className="gradient-text">trust and recommend</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                AI systems don&apos;t rank businesses the way Google does. They look for specific trust signals —
                structured authority data, citation-friendly content, and explicit AI access permissions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                CiteCheck reads your live website and tells you exactly which signals are missing,
                which are strong, and what to fix first for the highest recommendation impact.
              </p>
              <Link href="/scan">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary gap-2 font-semibold rounded-xl h-12 px-7">
                  Check my trust signals
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Section>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">
              Everything you need
            </div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">Your complete AI trust intelligence picture</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              One check. Every AI platform. A clear path to becoming the business AI trusts and recommends.
            </p>
          </Section>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => <FeatureCard key={f.title} {...f} index={i} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* ── REPORT PREVIEW ── */}
      <section id="preview" className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">
              Live Report Preview
            </div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">What your AI Trust Report looks like</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Real-data scoring across 5 trust dimensions, with live competitor benchmarking built in.
            </p>
          </Section>
          <StaggerGrid>
            <ReportPreview />
          </StaggerGrid>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">
              Results
            </div>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Businesses that got trusted by AI</h2>
          </Section>
          <StaggerGrid className="grid md:grid-cols-3 gap-5">
            {testimonials.map(t => <TestimonialCard key={t.name} {...t} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <Section className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">
              Questions
            </div>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Frequently asked</h2>
          </Section>
          <StaggerGrid className="space-y-3">
            {faqs.map(f => <FaqItem key={f.q} {...f} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <Section>
            <motion.div
              className="inline-flex w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-8 shadow-card"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Eye className="w-8 h-8 text-primary" />
            </motion.div>

            <h2 className="font-heading font-black text-5xl md:text-6xl leading-[0.95] mb-6">
              Start getting trusted<br />
              <span className="gradient-text">by AI search today.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Your free AI Trust Check takes under 60 seconds. No credit card. No commitment.
              Just clarity on where you stand — and exactly what to fix.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-12 text-lg font-semibold shadow-primary gap-2 rounded-xl"
            >
              <Link href="/scan">
                Run My Free AI Check
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-8 mt-8">
              {['Free check', 'No credit card', 'Instant results'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      <Footer />
    </div>
  )
}
