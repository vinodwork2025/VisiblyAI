import { NextRequest, NextResponse } from 'next/server'
import { runRealScan, runMockScan } from '@/lib/scan-engine'
import type { ScanFormData } from '@/types'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ScanFormData

    if (!body.businessName || !body.websiteUrl || !body.city || !body.primaryService) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
      const result = await runRealScan(body)
      return NextResponse.json(result)
    } catch {
      const result = runMockScan(body)
      return NextResponse.json(result)
    }
  } catch {
    return NextResponse.json({ error: 'Failed to process scan' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'VisiblyAI Scan API v1' })
}
