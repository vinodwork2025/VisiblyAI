'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText, Search, ExternalLink, TrendingUp, Calendar, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ScanResult } from '@/types'

interface ReportSummary {
  id: string
  businessName: string
  websiteUrl: string
  overallScore: number
  grade: string
  city: string
  primaryService: string
  createdAt: string
  fromDb?: boolean
}

function GradeBadge({ grade }: { grade: string }) {
  const color =
    grade === 'A' ? 'bg-primary/20 text-primary border-primary/30'    :
    grade === 'B' ? 'bg-chart-3/20 text-chart-3 border-chart-3/30'   :
    grade === 'C' ? 'bg-amber-accent/20 text-amber-accent border-amber-accent/30' :
    'bg-destructive/20 text-destructive border-destructive/30'
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${color}`}>
      {grade}
    </span>
  )
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 65 ? 'text-primary' : score >= 45 ? 'text-amber-accent' : 'severity-critical'
  return <span className={`font-heading font-black text-xl ${color}`}>{score}</span>
}

function sessionStorageReports(): ReportSummary[] {
  if (typeof window === 'undefined') return []
  const items: ReportSummary[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith('scan_')) {
      try {
        const data = JSON.parse(sessionStorage.getItem(key)!) as ScanResult
        items.push({
          id: data.id,
          businessName: data.businessName,
          websiteUrl: data.websiteUrl,
          overallScore: data.overallScore,
          grade: data.grade,
          city: data.city,
          primaryService: data.primaryService,
          createdAt: data.createdAt,
        })
      } catch {}
    }
  }
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'db' | 'session' | 'none'>('none')

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/scans')
        if (res.ok) {
          const json = await res.json() as { scans?: Array<{ id: string; business_name: string; website_url: string; overall_score: number; grade: string; city: string; primary_service: string; created_at: string }> }
          if (json.scans && json.scans.length > 0) {
            const mapped: ReportSummary[] = json.scans.map(s => ({
              id: s.id,
              businessName: s.business_name,
              websiteUrl: s.website_url,
              overallScore: s.overall_score,
              grade: s.grade,
              city: s.city,
              primaryService: s.primary_service,
              createdAt: s.created_at,
              fromDb: true,
            }))
            setReports(mapped)
            setSource('db')
            return
          }
        }
      } catch {}

      // Fall back to sessionStorage
      const local = sessionStorageReports()
      setReports(local)
      setSource(local.length > 0 ? 'session' : 'none')
    }

    load().finally(() => setLoading(false))
  }, [])

  async function deleteReport(report: ReportSummary) {
    if (report.fromDb) {
      try {
        await fetch(`/api/scans/${report.id}`, { method: 'DELETE' })
      } catch {}
    }
    sessionStorage.removeItem(`scan_${report.id}`)
    setReports(prev => prev.filter(r => r.id !== report.id))
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-heading font-black text-3xl">My Reports</h1>
        </div>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-3xl mb-1">My Reports</h1>
          <p className="text-muted-foreground text-sm">
            {source === 'db' ? 'Synced from your account.' : 'Your saved AI Trust Check history.'}
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/scan">
            <Search className="w-4 h-4 mr-2" />
            New Scan
          </Link>
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-5">
            <FileText className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-heading font-bold text-xl mb-2">No reports yet</h2>
          <p className="text-muted-foreground text-sm max-w-sm mb-6">
            Run your first AI Trust Check to see how trusted and visible your business is across ChatGPT, Gemini, and more.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/scan">Run Free Scan</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => {
            const date = new Date(report.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })
            return (
              <div key={report.id} className="rounded-2xl border border-border bg-card p-5 md:p-6 hover-lift">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-semibold text-lg truncate">{report.businessName}</h3>
                      <GradeBadge grade={report.grade} />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <a
                        href={report.websiteUrl.startsWith('http') ? report.websiteUrl : `https://${report.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        {report.websiteUrl.replace(/^https?:\/\//, '').slice(0, 40)}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">{report.city}</span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="text-xs text-muted-foreground">{report.primaryService}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {date}
                      {report.fromDb && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">Saved</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <div className="text-center">
                      <ScorePill score={report.overallScore} />
                      <div className="text-xs text-muted-foreground">Trust Score</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteReport(report)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Delete report"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/results/${report.id}`}>
                          View Report
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
