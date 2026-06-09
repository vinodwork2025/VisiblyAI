import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { runRealScan } from '@/lib/scan-engine'
import { checkGeminiVisibility } from '@/lib/visibility-gemini'
import type { ScanFormData, ScanResult } from '@/types'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function createSupabase(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll()  {},
    },
  })
}

// ── Simple best-effort rate limit (in-memory, per Worker instance) ────────────
// Not persistent across CF Worker restarts/instances. Use CF WAF rules for
// production-grade limiting. Provides basic protection in dev/staging.
const scanTimes = new Map<string, number[]>()
const RATE_LIMIT = 5           // max scans per window
const RATE_WINDOW = 60 * 60 * 1000  // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const times = (scanTimes.get(ip) ?? []).filter(t => now - t < RATE_WINDOW)
  if (times.length >= RATE_LIMIT) return false
  scanTimes.set(ip, [...times, now])
  return true
}

async function persistScan(supabase: ReturnType<typeof createSupabase>, result: ScanResult, userId: string) {
  if (!supabase) return
  await supabase.from('scans').insert({
    id: result.id,
    user_id: userId,
    business_name: result.businessName,
    website_url: result.websiteUrl,
    city: result.city,
    primary_service: result.primaryService,
    competitors: result.competitors,
    overall_score: result.overallScore,
    grade: result.grade,
    categories: result.categories,
    insights: result.insights,
    problems: result.problems,
    recommendations: result.recommendations,
    quick_wins: result.quickWins,
    competitor_comparison: result.competitorComparison,
    gemini_visibility: result.geminiVisibility ?? null,
    created_at: result.createdAt,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many scans. Please wait before trying again.' }, { status: 429 })
    }

    const body = await request.json() as ScanFormData

    // Honeypot — bots fill hidden fields, humans don't
    if (body.honeypot) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    if (!body.businessName || !body.websiteUrl || !body.city || !body.primaryService) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Scanning is not configured. Please set GEMINI_API_KEY to enable AI visibility checks.' },
        { status: 503 }
      )
    }

    // Run Gemini visibility check and site technical scan in parallel
    const [geminiResult, result] = await Promise.all([
      checkGeminiVisibility(body.businessName, body.websiteUrl, body.city, body.primaryService),
      // We run a preliminary site scan first to get technical data,
      // then the full scan merges both. Since analyzeSite is internal,
      // we pass gemini result to runRealScan after both finish.
      Promise.resolve(null),
    ])

    // Full scan with Gemini data
    const finalResult: ScanResult = await runRealScan(body, geminiResult ?? undefined)
    void result  // unused placeholder

    // Persist to DB if user is authenticated (non-blocking)
    try {
      const supabase = createSupabase(request)
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) await persistScan(supabase, finalResult, user.id)
      }
    } catch {
      // DB failure does not break scan response
    }

    return NextResponse.json(finalResult)
  } catch {
    return NextResponse.json({ error: 'Failed to process scan. Please try again.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'VisiblyAI Scan API v2 — Gemini-powered' })
}
