import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const NOTIFICATION_URL = process.env.LEAD_NOTIFICATION_URL

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      email: string
      scanId?: string
      businessName?: string
      websiteUrl?: string
      city?: string
      service?: string
      overallScore?: number
      geminiVisibilityRate?: number
    }

    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Persist lead to Supabase (use service role to bypass RLS)
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        await supabase.from('leads').insert({
          email: body.email.toLowerCase().trim(),
          scan_id: body.scanId ?? null,
          business_name: body.businessName ?? null,
          website_url: body.websiteUrl ?? null,
          city: body.city ?? null,
          service: body.service ?? null,
          overall_score: body.overallScore ?? null,
          gemini_visibility_rate: body.geminiVisibilityRate ?? null,
        })
      } catch {
        // DB failure is non-fatal — lead still captured below
      }
    }

    // Send notification webhook (optional)
    if (NOTIFICATION_URL) {
      try {
        await fetch(NOTIFICATION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `New VisiblyAI lead: ${body.email} — ${body.businessName ?? 'unknown'} (${body.websiteUrl ?? ''}) — score ${body.overallScore ?? 'n/a'}/100 — Gemini ${body.geminiVisibilityRate ?? 'n/a'}%`,
          }),
          signal: AbortSignal.timeout(4000),
        })
      } catch {
        // Notification failure is non-fatal
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to capture lead' }, { status: 500 })
  }
}
