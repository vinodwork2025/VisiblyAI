'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Zap } from 'lucide-react'

const SCAN_STEPS = [
  { id: 1, label: 'Analyzing AI visibility signals…',     detail: 'Checking your presence across ChatGPT, Gemini & Perplexity'  },
  { id: 2, label: 'Checking local authority…',            detail: 'Evaluating local SEO signals and geographic relevance'         },
  { id: 3, label: 'Scanning trust indicators…',           detail: 'Reviewing reviews, citations, and E-E-A-T signals'             },
  { id: 4, label: 'Comparing competitors…',               detail: 'Benchmarking your visibility against market competitors'       },
  { id: 5, label: 'Generating AI recommendations…',       detail: 'Building your personalized AI visibility action plan'         },
]

const STEP_DELAY = 1800

function LoadingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const scanId = searchParams.get('id')

  const [activeStep, setActiveStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!scanId) { router.push('/scan'); return }

    const timers: ReturnType<typeof setTimeout>[] = []

    SCAN_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(i + 1)
          if (i === SCAN_STEPS.length - 1) {
            setTimeout(() => {
              setDone(true)
              setTimeout(() => router.push(`/results/${scanId}`), 1200)
            }, 800)
          }
        }, STEP_DELAY * (i + 1))
      )
    })

    return () => timers.forEach(clearTimeout)
  }, [scanId, router])

  const progress = done ? 100 : Math.round((activeStep / SCAN_STEPS.length) * 100)

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Animated radar ring */}
      <div className="relative mb-12">
        {/* Outer pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border border-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-primary/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
        </div>

        {/* Spinning ring */}
        <div className="relative w-28 h-28">
          <svg className="absolute inset-0 w-full h-full animate-radar-spin" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="46" stroke="oklch(0.76 0.14 177 / 10%)" strokeWidth="2" />
            <path
              d="M 50 4 A 46 46 0 0 1 96 50"
              stroke="oklch(0.76 0.14 177)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
              done
                ? 'bg-primary/20 teal-glow'
                : 'bg-card border border-primary/20'
            }`}>
              {done ? (
                <CheckCircle className="w-8 h-8 text-primary animate-scale-in" />
              ) : (
                <Zap className="w-7 h-7 text-primary" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="font-heading font-black text-2xl md:text-3xl mb-2">
          {done ? (
            <span className="gradient-text">Analysis complete!</span>
          ) : (
            'Scanning your business…'
          )}
        </h1>
        <p className="text-sm text-muted-foreground">
          {done
            ? 'Redirecting you to your AI Visibility Report…'
            : 'Our AI is analyzing your visibility across 5 platforms'
          }
        </p>
      </div>

      {/* Steps */}
      <div className="w-full max-w-md mb-8 space-y-3">
        {SCAN_STEPS.map((step, i) => {
          const isActive    = activeStep === step.id
          const isCompleted = activeStep > step.id
          const isPending   = activeStep < step.id

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 rounded-xl p-4 border transition-all duration-500 ${
                isCompleted ? 'border-primary/20 bg-primary/5'  :
                isActive    ? 'border-primary/30 bg-primary/8'  :
                'border-border bg-card opacity-40'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${
                isCompleted ? 'bg-primary'         :
                isActive    ? 'bg-primary/20 border-2 border-primary' :
                'bg-secondary border border-border'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-primary-foreground animate-step-check" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium transition-colors ${
                  isCompleted ? 'text-primary' : isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.label}
                </div>
                {(isActive || isCompleted) && (
                  <div className="text-xs text-muted-foreground mt-0.5 animate-fade-in">
                    {step.detail}
                  </div>
                )}
              </div>

              {/* Time indicator */}
              {isCompleted && (
                <div className="text-xs text-primary font-medium shrink-0 animate-fade-in">✓</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Analysis progress</span>
          <span className="text-primary font-mono font-bold">{progress}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground mt-8 text-center max-w-xs">
        Analyzing visibility signals across ChatGPT, Google AI, Gemini, Perplexity, and local AI search
      </p>
    </div>
  )
}

export default function ScanLoadingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen mesh-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <LoadingContent />
    </Suspense>
  )
}
