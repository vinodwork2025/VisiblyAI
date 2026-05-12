'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import {
  motion, useInView, useMotionValue, useTransform,
  animate, AnimatePresence, type Variants,
} from 'framer-motion'
import {
  ArrowRight, CheckCircle, Zap, Target,
  Search, BarChart2, ChevronDown, Eye, Brain, Globe,
  AlertCircle, Sparkles, Award, Users, Clock,
  Shield, TrendingUp, Star, Lock, Play,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}
const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}
const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
}

/* ─────────────────────────────────────────────
   SHARED WRAPPERS
───────────────────────────────────────────── */
function Section({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
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

function StaggerGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px 0px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   HERO COMPONENTS
───────────────────────────────────────────── */

/* Animated background orbs */
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {/* Primary teal orb — top-left */}
      <div
        className="absolute -top-64 -left-64 w-[700px] h-[700px] rounded-full animate-orb-1"
        style={{ background: 'radial-gradient(circle, oklch(0.72 0.14 177 / 16%) 0%, transparent 68%)' }}
      />
      {/* Indigo/purple orb — bottom-right */}
      <div
        className="absolute -bottom-48 -right-48 w-[650px] h-[650px] rounded-full animate-orb-2"
        style={{ background: 'radial-gradient(circle, oklch(0.60 0.20 290 / 13%) 0%, transparent 68%)' }}
      />
      {/* Amber accent — top-right */}
      <div
        className="absolute -top-32 right-1/4 w-[380px] h-[380px] rounded-full animate-orb-3"
        style={{ background: 'radial-gradient(circle, oklch(0.72 0.16 73 / 8%) 0%, transparent 68%)' }}
      />
      {/* Subtle center bloom */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(ellipse, oklch(0.72 0.14 177 / 8%) 0%, transparent 70%)' }}
      />
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-[0.22]" />
      {/* Scattered network nodes */}
      {[
        { top: '18%', left: '12%', size: 3, delay: 0 },
        { top: '62%', left: '8%',  size: 2, delay: 1.2 },
        { top: '35%', left: '88%', size: 3, delay: 0.6 },
        { top: '72%', left: '82%', size: 2, delay: 2 },
        { top: '14%', left: '55%', size: 2, delay: 1.8 },
        { top: '85%', left: '45%', size: 3, delay: 0.9 },
      ].map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/50"
          style={{ top: node.top, left: node.left, width: node.size, height: node.size }}
          animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.6, 1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
        />
      ))}
    </div>
  )
}

/* Animated score count-up */
function AnimatedScore({ target, delay = 0 }: { target: number; delay?: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true })

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, target, {
      duration: 2,
      delay,
      ease: [0.22, 1, 0.36, 1],
    })
    return controls.stop
  }, [inView, count, target, delay])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

/* Hero dashboard card — right side */
function HeroScoreCard() {
  const circumference = 2 * Math.PI * 52
  const score = 87
  const offset = circumference * (1 - score / 100)

  const platforms = [
    { name: 'ChatGPT',          status: 'Visible',      pct: 92, green: true  },
    { name: 'Google AI',        status: 'Strong',       pct: 78, green: true  },
    { name: 'Gemini',           status: 'Moderate',     pct: 54, green: false },
    { name: 'Perplexity',       status: 'Low Visibility', pct: 31, green: false },
  ]

  const competitors = [
    { name: 'Meridian Legal',  score: 91, isTop: true  },
    { name: 'Your Brand',      score: 87, isUser: true },
    { name: 'Apex Advisory',   score: 54               },
    { name: 'Vertex Group',    score: 43               },
  ]

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 -m-8 rounded-[3rem] pointer-events-none">
        <div className="absolute inset-0 rounded-[3rem] border border-primary/12 animate-ring-pulse" />
        <div className="absolute inset-4 rounded-[2.5rem] border border-primary/8 animate-ring-pulse-slow" />
      </div>

      {/* Floating motion wrapper */}
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Main glass card */}
        <div className="hero-glass rounded-3xl p-6 relative overflow-hidden">

          {/* Inner top gradient accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-24 rounded-full blur-2xl opacity-20"
            style={{ background: 'oklch(0.72 0.14 177 / 60%)' }}
          />

          {/* Card header */}
          <div className="flex items-center justify-between mb-5 relative">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest">Live analysis</span>
              </div>
              <div className="font-heading font-bold text-sm text-foreground">Vertex & Associates</div>
            </div>
            <div className="badge-local text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wide">
              CiteCheck Report
            </div>
          </div>

          {/* Score gauge */}
          <div className="flex items-center justify-center mb-5 relative">
            <div className="relative w-36 h-36">
              {/* Glow behind gauge */}
              <div className="absolute inset-0 rounded-full blur-xl opacity-20"
                style={{ background: 'oklch(0.72 0.14 177 / 80%)' }}
              />
              <svg viewBox="0 0 120 120" className="w-full h-full relative z-10">
                <defs>
                  <linearGradient id="gaugeGrad" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.14 177)" />
                    <stop offset="50%" stopColor="oklch(0.76 0.16 200)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.18 290)" />
                  </linearGradient>
                </defs>
                {/* Track */}
                <circle cx="60" cy="60" r="52" fill="none" strokeWidth="7"
                  stroke="oklch(0.5 0.01 240 / 20%)" />
                {/* Animated arc */}
                <motion.circle
                  cx="60" cy="60" r="52"
                  fill="none"
                  stroke="url(#gaugeGrad)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 2.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              {/* Score number */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.div
                  className="font-heading font-black text-4xl gradient-text leading-none tabular-nums"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <AnimatedScore target={score} delay={0.9} />
                </motion.div>
                <div className="text-[10px] text-primary font-semibold mt-0.5 uppercase tracking-widest">Excellent</div>
              </div>
            </div>
          </div>

          {/* Platform visibility */}
          <div className="mb-5">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Platform Visibility</div>
            <div className="space-y-2">
              {platforms.map(({ name, status, pct, green }, i) => (
                <motion.div
                  key={name}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 + i * 0.07, ease: 'easeOut' }}
                >
                  <div className="w-24 text-xs text-muted-foreground shrink-0 font-medium truncate">{name}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${green ? 'bg-gradient-to-r from-primary to-cyan-400' : 'bg-gradient-to-r from-muted-foreground/40 to-muted-foreground/20'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, delay: 1.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold shrink-0 w-20 text-right ${green ? 'text-primary' : 'text-muted-foreground'}`}>
                    {status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider-fade mb-4" />

          {/* Competitor comparison */}
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">AI Recommendation Ranking</div>
            <div className="space-y-2">
              {competitors.map(({ name, score: s, isUser, isTop }, i) => (
                <motion.div
                  key={name}
                  className={`flex items-center gap-3 rounded-lg px-2.5 py-1.5 ${isUser ? 'bg-primary/10 border border-primary/20' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.8 + i * 0.07 }}
                >
                  <div className={`w-20 text-xs shrink-0 font-medium truncate ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>
                    {name}
                  </div>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isUser ? 'bg-gradient-to-r from-primary to-cyan-400' : isTop ? 'bg-emerald-400' : 'bg-muted-foreground/30'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${s}%` }}
                      transition={{ duration: 1.2, delay: 1.9 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <div className={`w-7 text-xs text-right font-heading font-bold tabular-nums shrink-0 ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom gradient fade */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card/20 to-transparent rounded-b-3xl" />
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function HeroSection() {
  const headlineParts: { text: string; shimmer?: boolean }[] = [
    { text: 'Understand how AI systems' },
    { text: 'perceive', shimmer: true },
    { text: 'and' },
    { text: 'recommend', shimmer: true },
    { text: 'your brand.' },
  ]

  const trustItems = [
    { icon: CheckCircle, text: 'No Credit Card Required' },
    { icon: Zap,         text: '2-Minute Quick Scan'    },
    { icon: TrendingUp,  text: 'Actionable Insights'    },
  ]

  const logos = ['Zapier', 'Deel', 'Intuit', 'Brevo', 'MongoDB', 'Pearson']

  const bottomCards = [
    { icon: Eye,         title: 'AI Visibility Monitoring',    desc: 'Track how ChatGPT, Gemini, and Google AI discover and mention your brand across AI-powered search.' },
    { icon: Shield,      title: 'AI Trust & Citation Signals', desc: 'Evaluate the technical signals that determine whether AI systems trust and recommend your business.' },
    { icon: BarChart2,   title: 'Actionable Growth Insights',  desc: 'Prioritized recommendations built from your live site data — not generic templates.' },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16">
      <HeroBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* Two-column grid */}
        <div className="grid lg:grid-cols-[1fr_480px] gap-14 xl:gap-20 items-center">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold badge-local shadow-card shimmer-bg">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                AI TRUST &amp; VISIBILITY INTELLIGENCE
              </span>
            </motion.div>

            {/* Headline — word-by-word reveal */}
            <div>
              <h1 className="font-heading font-black text-5xl md:text-6xl xl:text-7xl leading-[1.0] tracking-tight">
                {headlineParts.map((part, i) => (
                  <motion.span
                    key={i}
                    className={`inline ${part.shimmer ? 'gradient-text-shimmer' : ''}`}
                    initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {part.text}{' '}
                  </motion.span>
                ))}
              </h1>
            </div>

            {/* Subheadline */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              Monitor your visibility across ChatGPT, Google AI Overviews, Gemini, Perplexity,
              and the future of AI-powered search.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Primary */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                <Link href="/scan">
                  <button className="group relative inline-flex items-center gap-2.5 h-13 px-8 text-base font-semibold text-primary-foreground rounded-xl overflow-hidden shadow-primary transition-shadow hover:shadow-[0_6px_28px_oklch(0.72_0.14_177_/_45%)]"
                    style={{ background: 'linear-gradient(135deg, oklch(0.60 0.15 177) 0%, oklch(0.52 0.16 177) 50%, oklch(0.55 0.18 290) 100%)' }}
                  >
                    {/* Shimmer sweep on hover */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <span className="relative">Run Free AI Visibility Check</span>
                    <motion.span
                      className="relative"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </button>
                </Link>
              </motion.div>

              {/* Secondary */}
              <Link href="#preview">
                <button className="group inline-flex items-center gap-2 h-13 px-6 text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-8 h-8 rounded-full border border-border bg-card/80 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/8 transition-all duration-200">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                  <span className="relative">
                    View Sample Report
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </span>
                </button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              {trustItems.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="w-2.5 h-2.5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">{text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Logo cloud */}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.4 }}
            >
              <p className="text-xs text-muted-foreground/50 uppercase tracking-widest font-semibold mb-4">
                Trusted by businesses worldwide
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                {logos.map((name, i) => (
                  <motion.span
                    key={name}
                    className="font-heading font-bold text-sm text-muted-foreground/30 hover:text-muted-foreground/60 cursor-default select-none transition-colors duration-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.5 + i * 0.06 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Dashboard card ── */}
          <div className="hidden lg:block">
            <HeroScoreCard />
          </div>
        </div>

        {/* ── BOTTOM FEATURE STRIP ── */}
        <motion.div
          className="grid sm:grid-cols-3 gap-4 mt-20"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 1.6 } } }}
        >
          {bottomCards.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="hero-glass rounded-2xl p-6 hover-lift group cursor-default"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/18 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-heading font-bold text-sm text-foreground mb-1.5">{title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <ChevronDown className="w-5 h-5 text-muted-foreground/40" />
      </motion.div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PAGE-LEVEL COMPONENTS (unchanged)
───────────────────────────────────────────── */

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

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative rounded-2xl border border-border bg-card p-7 hover-lift shadow-card"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-heading font-bold text-base mb-2.5 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
    </motion.div>
  )
}

function StepCard({ number, icon: Icon, title, description }: { number: string; icon: React.ElementType; title: string; description: string }) {
  return (
    <motion.div variants={fadeUp} className="relative rounded-2xl border border-border bg-card p-8 shadow-card hover-lift">
      <div className="flex items-start gap-5 mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="font-heading font-black text-5xl text-primary/10 leading-none mt-1">{number}</span>
      </div>
      <h3 className="font-heading font-bold text-lg mb-3 text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  )
}

function TestimonialCard({ quote, name, role, initial }: { quote: string; name: string; role: string; initial: string }) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-border bg-card p-7 flex flex-col shadow-card hover-lift">
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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <motion.details variants={fadeUp} className="group border border-border rounded-xl overflow-hidden bg-card shadow-card">
      <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none hover:bg-secondary/50 transition-colors">
        <span className="text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform duration-300" />
      </summary>
      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>
    </motion.details>
  )
}

function ReportPreview() {
  const categories = [
    { label: 'AI Rec. Visibility',       score: 42, color: 'bg-rose-400'  },
    { label: 'Brand Authority',           score: 61, color: 'bg-primary'   },
    { label: 'Citation Trust Signals',    score: 55, color: 'bg-primary'   },
    { label: 'Content Coverage',          score: 38, color: 'bg-amber-400' },
    { label: 'Technical Trust Readiness', score: 74, color: 'bg-primary'   },
  ]
  const competitors = [
    { name: 'Meridian Legal Group', score: 78, isTop: true  },
    { name: 'Vertex & Associates',  score: 54, isUser: true },
    { name: 'Apex Advisory Co.',    score: 46               },
  ]
  return (
    <motion.div variants={fadeUp} className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border bg-card shadow-card-lg p-7 md:p-9">
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> CiteCheck AI Trust Report
          </div>
          <div className="font-heading font-bold text-xl text-foreground">Vertex & Associates</div>
          <div className="text-sm text-muted-foreground">London, UK · Professional Services</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-heading font-black gradient-text leading-none">54</div>
          <div className="text-xs text-muted-foreground mt-1">AI Trust Score</div>
        </div>
      </div>
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
const stats = [
  { value: '14,000+', label: 'Businesses analyzed'               },
  { value: '73%',     label: 'Missing from AI recommendations'   },
  { value: '5',       label: 'AI platforms monitored'            },
  { value: '< 60s',   label: 'Time to your AI Trust Score'       },
]

const steps = [
  { number: '01', icon: Search,   title: 'Enter your business details',       description: 'Provide your business name, website, and primary service. Takes under 60 seconds — no credit card, no commitment.' },
  { number: '02', icon: Brain,    title: 'CiteCheck scans live data',          description: 'Our engine reads your site in real time — AI crawler access, llms.txt, schema markup, and content signals — to build your actual AI trust profile.' },
  { number: '03', icon: BarChart2, title: 'Get your AI Trust Intelligence report', description: 'A full report: your AI Trust Score, competitor benchmarking, detected trust gaps, and a prioritized action plan to improve your AI recommendation visibility.' },
]

const features = [
  { icon: Globe,      title: 'Multi-Platform AI Coverage',      description: 'Analyze trust signals across ChatGPT, Google AI Overviews, Gemini, Perplexity, and emerging AI-powered search — in a single check.' },
  { icon: Users,      title: 'Live Competitor Intelligence',    description: 'We scan your competitors\' sites in real time. See their actual AI trust signals vs. yours — no estimates, no guessing.' },
  { icon: Zap,        title: 'AI Trust Score',                  description: 'Scored across 5 dimensions: AI Recommendation Visibility, Citation Trust Signals, Brand Authority, Content Coverage, and Technical Trust Readiness.' },
  { icon: Target,     title: 'Strategic Action Plan',           description: 'Specific recommendations ranked by impact and effort — built from your real site data, not generic templates.' },
  { icon: Clock,      title: 'Quick Wins Surfaced',             description: 'High-impact actions — some completable in under 15 minutes — identified directly from your live scan results.' },
  { icon: Award,      title: 'Full Audit Ready',                description: 'Your CiteCheck report becomes the foundation for a full AI Trust Audit with a 90-day roadmap from our expert team.' },
]

const testimonials = [
  {
    quote: "We had strong traditional SEO but were invisible to AI search. CiteCheck showed us exactly what was missing — and results followed within weeks of fixing it.",
    name: 'James O.', role: 'CEO, Meridian Legal Group', initial: 'J',
  },
  {
    quote: "The competitor comparison was eye-opening. Our top rival had signals we'd never considered. CiteCheck made the problem — and the solution — immediately clear.",
    name: 'Sarah K.', role: 'Head of Growth, Luminary Agency', initial: 'S',
  },
  {
    quote: "We run a SaaS platform and AI discoverability is becoming critical. CiteCheck gave us a clear picture of where we stood and what to prioritize. Worth every minute.",
    name: 'Michael T.', role: 'Co-founder, Stackwell', initial: 'M',
  },
]

const faqs = [
  { q: 'What is AI recommendation visibility?', a: "AI recommendation visibility is how often and how prominently your brand appears when AI systems like ChatGPT, Gemini, Google AI Overviews, and Perplexity generate responses to user queries. As AI-powered search becomes the primary discovery channel, visibility in these systems is becoming as important as traditional search ranking." },
  { q: 'How does CiteCheck work?', a: "CiteCheck fetches live data directly from your website — robots.txt, llms.txt, JSON-LD schema, FAQ content, HTTPS status, and sitemap. We analyze whether AI crawlers can access your site, whether you have the trust and authority signals AI platforms require, and how your posture compares to competitors in real time." },
  { q: 'How accurate is the AI Trust Score?', a: "The score reflects real technical signals from your live website: AI crawler access (GPTBot, ClaudeBot, PerplexityBot), llms.txt presence, schema markup quality, FAQ content signals, HTTPS, and sitemap accessibility. These are the foundational factors that determine whether AI platforms can discover and trust your business." },
  { q: 'Do I need technical knowledge?', a: "None. Your report is written in clear business language. Every recommendation includes a plain-English explanation of what to do, why it matters for your AI recommendation rate, and how hard it is to implement." },
  { q: 'How is this different from SEO?', a: "Traditional SEO optimizes for search engine ranking algorithms. AI trust optimization targets the signals language models use when selecting sources for recommendations — citation authority, structured data, llms.txt, AI crawler access, and conversational content. Different systems, different signals, different outcomes." },
  { q: 'What do I get from the free check?', a: "A full CiteCheck AI Trust Report: your score across 5 dimensions, live competitor comparison, detected trust gaps with severity ratings, and a prioritized action plan. Implement quick wins yourself, or engage our team for a Full AI Trust Audit with 90-day roadmap." },
]

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <HeroSection />

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => <AnimatedStat key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <Section>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-6">The AI Search Shift</div>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-[1.05] mb-6">
                AI systems are the new gatekeepers of discovery.{' '}
                <span className="gradient-text">Is your brand trusted?</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5 text-base">
                Millions of customers now use ChatGPT, Gemini, and Google AI Overviews to research and discover businesses.
                These AI systems recommend brands based on trust and citation signals that most companies have never measured.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                If your brand lacks the right AI trust signals, you&apos;re invisible to a rapidly growing segment
                of your market — even if your traditional search presence is strong.
              </p>
              <ul className="space-y-3.5">
                {['73% of businesses are missing from AI recommendations entirely', 'AI-powered search intent growing 40% month over month', 'Businesses trusted by AI receive 2–3× more qualified inquiries'].map(item => (
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
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5">AI Recommendation Intelligence Snapshot</div>
                {[
                  { name: 'Meridian Legal Group', score: 78, status: 'Trusted & cited by ChatGPT', good: true  },
                  { name: 'Your Brand',            score: 31, status: 'Missing from AI results',    good: false },
                  { name: 'Apex Advisory Co.',     score: 62, status: 'Appears in Gemini answers',  good: true  },
                ].map(({ name, score, status, good }) => (
                  <div key={name} className={`rounded-xl p-4 border ${good ? 'border-border bg-secondary/40' : 'border-destructive/30 bg-destructive/8'}`}>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-sm font-semibold text-foreground">{name}</span>
                      <span className={`text-2xl font-heading font-black ${good ? 'text-primary' : 'text-destructive'}`}>{score}</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden mb-2.5">
                      <div className={`h-full rounded-full ${good ? 'bg-primary' : 'bg-destructive/60'}`} style={{ width: `${score}%` }} />
                    </div>
                    <span className={`text-xs font-medium ${good ? 'text-muted-foreground' : 'text-destructive'}`}>{status}</span>
                  </div>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">How it works</div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">From scan to AI visibility intelligence</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">Real data from your live website. Not estimates, not templates. Your actual AI trust posture.</p>
          </Section>
          <StaggerGrid className="grid md:grid-cols-3 gap-6">
            {steps.map(s => <StepCard key={s.number} {...s} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* TRUST SIGNALS EXPLAINER */}
      <section className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <Section delay={0.1}>
              <div className="rounded-2xl border border-border bg-card shadow-card-md p-7 space-y-4">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">What CiteCheck reads from your live site</div>
                {[
                  { icon: Lock,       label: 'AI Crawler Access',  sub: 'GPTBot, ClaudeBot, PerplexityBot permissions in robots.txt', ok: false },
                  { icon: Globe,      label: 'llms.txt File',       sub: 'AI-readable business context file at /llms.txt',            ok: false },
                  { icon: BarChart2,  label: 'Schema Markup',       sub: 'JSON-LD structured data: Organization, FAQPage, Review',    ok: true  },
                  { icon: Shield,     label: 'HTTPS & Sitemap',     sub: 'Technical trust baseline signals',                           ok: true  },
                  { icon: TrendingUp, label: 'Content Signals',     sub: 'Conversational content AI can extract, cite, and reference',ok: false },
                ].map(({ icon: Icon, label, sub, ok }) => (
                  <div key={label} className={`flex items-start gap-4 rounded-xl p-4 border ${ok ? 'border-border bg-secondary/30' : 'border-destructive/30 bg-destructive/8'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${ok ? 'bg-primary/10 border border-primary/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                      <Icon className={`w-4 h-4 ${ok ? 'text-primary' : 'text-destructive'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">{label}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ok ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>{ok ? 'OK' : 'Issue'}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
            <Section delay={0.2}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-6">Signal Intelligence</div>
              <h2 className="font-heading font-black text-4xl md:text-5xl leading-[1.05] mb-6">
                How AI platforms decide which brands to{' '}
                <span className="gradient-text">trust and recommend</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                AI systems don&apos;t rank brands the way search engines do. They look for specific authority signals —
                structured data, citation-friendly content, and explicit AI access permissions.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8 text-base">
                CiteCheck reads your live site and tells you exactly which signals are missing, which are strong,
                and what to fix first for the highest recommendation impact.
              </p>
              <Link href="/scan">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary gap-2 font-semibold rounded-xl h-12 px-7">
                  Check my AI trust signals <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </Section>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">Platform capabilities</div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">Complete AI trust intelligence</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">One check. Every AI platform. A clear path to becoming the brand AI systems trust and recommend.</p>
          </Section>
          <StaggerGrid className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => <FeatureCard key={f.title} {...f} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* REPORT PREVIEW */}
      <section id="preview" className="py-28 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">Sample report</div>
            <h2 className="font-heading font-black text-4xl md:text-5xl mb-4">Your AI Trust Intelligence report</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">Scored across 5 trust dimensions, with live competitor benchmarking and a clear action plan.</p>
          </Section>
          <StaggerGrid><ReportPreview /></StaggerGrid>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 section-alt border-y border-border">
        <div className="max-w-7xl mx-auto">
          <Section className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">Outcomes</div>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Brands that got trusted by AI</h2>
          </Section>
          <StaggerGrid className="grid md:grid-cols-3 gap-5">
            {testimonials.map(t => <TestimonialCard key={t.name} {...t} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <Section className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold badge-local mb-5">Questions</div>
            <h2 className="font-heading font-black text-4xl md:text-5xl">Frequently asked</h2>
          </Section>
          <StaggerGrid className="space-y-3">
            {faqs.map(f => <FaqItem key={f.q} {...f} />)}
          </StaggerGrid>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
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
              Know exactly where AI<br />
              <span className="gradient-text">stands on your brand.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Your free AI Trust Check takes under 60 seconds. No credit card. No commitment.
              Just clarity on where you stand — and exactly what to fix.
            </p>
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-12 text-lg font-semibold shadow-primary gap-2 rounded-xl">
              <Link href="/scan">Run My Free AI Check <ArrowRight className="w-5 h-5" /></Link>
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
