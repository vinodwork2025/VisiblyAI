import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { runRealScan, runMockScan } from '@/lib/scan-engine'
import type { ScanFormData, ScanResult } from '@/types'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const OPENAI_KEY   = process.env.OPENAI_API_KEY

function createSupabase(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null
  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll()  {},
    },
  })
}

async function enhanceWithAI(result: ScanResult, form: ScanFormData): Promise<ScanResult> {
  if (!OPENAI_KEY) return result

  try {
    const weakest = Object.entries(result.categories)
      .sort(([, a], [, b]) => (a as number) - (b as number))
      .slice(0, 2)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `You are an AI SEO expert. Generate 3 specific, actionable JSON recommendations to improve AI search visibility.

Business: ${form.businessName}
Location: ${form.city}
Service: ${form.primaryService}
Overall AI Trust Score: ${result.overallScore}/100
Weakest categories: ${weakest}

Return valid JSON only: {"recommendations": [{"title": "string max 55 chars", "description": "string max 160 chars", "impact": "high|medium|low", "effort": "easy|medium|hard", "category": "string"}]}`,
        }],
        response_format: { type: 'json_object' },
        max_tokens: 600,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(9000),
    })

    if (!res.ok) return result

    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> }
    const content = data.choices?.[0]?.message?.content
    if (!content) return result

    const parsed = JSON.parse(content) as { recommendations?: unknown[] }
    const items = Array.isArray(parsed.recommendations) ? parsed.recommendations : []
    if (items.length === 0) return result

    const aiRecs = items.slice(0, 3).map((item, i) => {
      const rec = item as Record<string, string>
      return {
        id: `ai-${Date.now()}-${i}`,
        title: rec.title ?? 'AI Recommendation',
        description: rec.description ?? '',
        impact: (rec.impact as 'high' | 'medium' | 'low') ?? 'medium',
        effort: (rec.effort as 'easy' | 'medium' | 'hard') ?? 'medium',
        category: rec.category ?? 'AI Optimization',
      }
    })

    return { ...result, recommendations: [...aiRecs, ...result.recommendations.slice(0, 3)] }
  } catch {
    return result
  }
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
    created_at: result.createdAt,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ScanFormData

    if (!body.businessName || !body.websiteUrl || !body.city || !body.primaryService) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run scan (real with fallback to mock)
    let result: ScanResult
    try {
      result = await runRealScan(body)
    } catch {
      result = runMockScan(body)
    }

    // Enhance with AI recommendations (best-effort, non-blocking)
    result = await enhanceWithAI(result, body)

    // Persist to DB if user is authenticated
    try {
      const supabase = createSupabase(request)
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await persistScan(supabase, result, user.id)
        }
      }
    } catch {
      // DB failure doesn't break scan response
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to process scan' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'VisiblyAI Scan API v1' })
}
