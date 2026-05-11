'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Search, Building2, MapPin, Wrench, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ScanFormData } from '@/types'

const STEPS = [
  { id: 1, title: 'Business Info',      icon: Building2, description: 'Tell us about your business'       },
  { id: 2, title: 'Location & Service', icon: MapPin,     description: 'Where you operate and what you do' },
  { id: 3, title: 'Competitors',        icon: Users,      description: 'Who you compete with (optional)'   },
]

const SERVICE_OPTIONS = [
  'Roofing', 'Dental / Dentistry', 'HVAC', 'Plumbing', 'Legal / Law Firm',
  'Real Estate', 'Landscaping', 'Accounting / CPA', 'Chiropractic',
  'Physical Therapy', 'Gym / Fitness', 'Restaurant', 'Retail', 'Electrician',
  'Painting', 'Flooring', 'Pest Control', 'Auto Repair', 'Other',
]

export default function ScanPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ScanFormData>({
    businessName: '',
    websiteUrl: '',
    city: '',
    primaryService: '',
    competitors: '',
  })
  const [errors, setErrors] = useState<Partial<ScanFormData>>({})

  function update(field: keyof ScanFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  function validateStep(s: number): boolean {
    const e: Partial<ScanFormData> = {}
    if (s === 1) {
      if (!form.businessName.trim()) e.businessName = 'Business name is required'
      if (!form.websiteUrl.trim())   e.websiteUrl   = 'Website URL is required'
    }
    if (s === 2) {
      if (!form.city.trim())           e.city           = 'City is required'
      if (!form.primaryService.trim()) e.primaryService = 'Please select a service'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  function back() { setStep(s => s - 1) }

  function handleSubmit() {
    setLoading(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pending_scan_form', JSON.stringify(form))
    }
    router.push('/scan/loading')
  }

  const progress = ((step - 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-local text-xs font-medium mb-4">
            <Search className="w-3 h-3" />
            Free AI Visibility Scan
          </div>
          <h1 className="font-heading font-black text-3xl md:text-4xl mb-2">
            Scan your business
          </h1>
          <p className="text-muted-foreground text-sm">
            Step {step} of {STEPS.length} · {STEPS[step - 1].description}
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 8)}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s.id < step  ? 'bg-primary text-primary-foreground'       :
                s.id === step ? 'bg-primary/20 border-2 border-primary text-primary' :
                'bg-secondary text-muted-foreground'
              }`}>
                {s.id < step ? '✓' : s.id}
              </div>
              {s.id < STEPS.length && <div className={`w-8 h-px ${s.id < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  placeholder="e.g. Apex Roofing Company"
                  value={form.businessName}
                  onChange={e => update('businessName', e.target.value)}
                  className={`h-12 bg-secondary border-border text-base ${errors.businessName ? 'border-destructive' : ''}`}
                />
                {errors.businessName && <p className="text-xs severity-critical">{errors.businessName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Website URL *
                </Label>
                <Input
                  id="websiteUrl"
                  placeholder="e.g. apexroofing.com"
                  value={form.websiteUrl}
                  onChange={e => update('websiteUrl', e.target.value)}
                  className={`h-12 bg-secondary border-border text-base ${errors.websiteUrl ? 'border-destructive' : ''}`}
                />
                {errors.websiteUrl && <p className="text-xs severity-critical">{errors.websiteUrl}</p>}
                <p className="text-xs text-muted-foreground">Include or omit https:// — both work</p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  City / Market *
                </Label>
                <Input
                  id="city"
                  placeholder="e.g. Dallas, TX"
                  value={form.city}
                  onChange={e => update('city', e.target.value)}
                  className={`h-12 bg-secondary border-border text-base ${errors.city ? 'border-destructive' : ''}`}
                />
                {errors.city && <p className="text-xs severity-critical">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Primary Service *
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICE_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update('primaryService', s)}
                      className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                        form.primaryService === s
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-secondary hover:border-primary/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {errors.primaryService && <p className="text-xs severity-critical">{errors.primaryService}</p>}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="competitors" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Main Competitors
                  </Label>
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </div>
                <Textarea
                  id="competitors"
                  placeholder="e.g. bestplumber.com, dallas-plumbers.com&#10;&#10;Enter URLs for live competitor analysis, or just names"
                  value={form.competitors}
                  onChange={e => update('competitors', e.target.value)}
                  className="bg-secondary border-border resize-none text-sm min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Add URLs for live competitor scanning, or just names for estimated comparison.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-secondary border border-border p-4 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Scan Summary</div>
                {[
                  { label: 'Business', value: form.businessName },
                  { label: 'Website',  value: form.websiteUrl   },
                  { label: 'Location', value: form.city         },
                  { label: 'Service',  value: form.primaryService },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-medium truncate max-w-[200px]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <Button variant="ghost" onClick={back} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < STEPS.length ? (
              <Button onClick={next} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 teal-glow"
              >
                {loading ? 'Starting scan…' : 'Run My AI Scan'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Free scan · No credit card · Results in under 60 seconds
        </p>
      </div>
    </div>
  )
}
