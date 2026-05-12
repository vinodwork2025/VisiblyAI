import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

type Params = Promise<{ id: string }>

function dbRowToScanResult(row: Record<string, unknown>) {
  return {
    id: row.id,
    businessName: row.business_name,
    websiteUrl: row.website_url,
    city: row.city,
    primaryService: row.primary_service,
    competitors: row.competitors,
    overallScore: row.overall_score,
    grade: row.grade,
    categories: row.categories,
    insights: row.insights,
    problems: row.problems,
    recommendations: row.recommendations,
    quickWins: row.quick_wins,
    competitorComparison: row.competitor_comparison,
    createdAt: row.created_at,
  }
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const { id } = await params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(dbRowToScanResult(data as Record<string, unknown>))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch scan' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Not configured' }, { status: 400 })
  }

  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase.from('scans').delete().eq('id', id).eq('user_id', user.id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete scan' }, { status: 500 })
  }
}
