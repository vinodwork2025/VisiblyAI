import { GoogleGenAI } from '@google/genai'

export interface GeminiQuestionResult {
  question: string
  appeared: boolean
  competitorsSeen: { name: string; domain?: string }[]
  citedUrls: string[]
}

export interface GeminiVisibilityResult {
  appearedInCount: number
  totalQuestions: number
  visibilityRate: number          // 0–100
  questionResults: GeminiQuestionResult[]
  topCompetitors: { name: string; domain?: string; appearances: number }[]
  error?: string
}

function buildQuestions(service: string, city: string): string[] {
  return [
    `best ${service} in ${city}`,
    `who are the top ${service} providers in ${city}`,
    `recommend a reliable ${service} near ${city}`,
    `which ${service} in ${city} has the best reviews`,
    `trusted ${service} firm in ${city}`,
  ]
}

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}

function domainOf(uri: string): string | undefined {
  try { return new URL(uri).hostname.replace(/^www\./, '') } catch { return undefined }
}

function userDomainOf(url: string): string | undefined {
  const full = url.startsWith('http') ? url : `https://${url}`
  return domainOf(full)
}

// Extract a display name from a grounding chunk title.
// "Design Intend | Architects Hosur" → "Design Intend"
// "Top 10 Architects in Hosur - Sulekha" → use domain
function cleanTitle(title: string, domain: string): string {
  const parts = title.split(/\s+[|–—-]\s+/)
  const first = parts[0]?.trim() ?? ''
  if (!first || /^(top|best|list of|find|search|home|welcome|about|\d+)/i.test(first) || first.length > 60) {
    return domain
  }
  return first
}

export async function checkGeminiVisibility(
  businessName: string,
  websiteUrl: string,
  city: string,
  service: string,
): Promise<GeminiVisibilityResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { appearedInCount: 0, totalQuestions: 0, visibilityRate: 0, questionResults: [], topCompetitors: [], error: 'GEMINI_API_KEY not configured' }
  }

  const ai = new GoogleGenAI({ apiKey })
  const questions = buildQuestions(service, city)
  const userDomain = userDomainOf(websiteUrl)
  const normBusiness = norm(businessName)

  // Count competitor appearances across all questions
  const competitorMap = new Map<string, { name: string; domain?: string; appearances: number }>()

  // Run all questions in parallel
  const questionResults: GeminiQuestionResult[] = await Promise.all(
    questions.map(async (question): Promise<GeminiQuestionResult> => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: question,
          config: {
            tools: [{ googleSearch: {} }],
          },
        })

        const answerText = response.text ?? ''
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chunks: any[] = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks ?? []

        // Did the business appear in the answer or in cited sources?
        let appeared = norm(answerText).includes(normBusiness)

        if (!appeared && userDomain) {
          appeared = chunks.some((c: { web?: { uri?: string } }) => {
            const d = domainOf(c.web?.uri ?? '')
            return d && d.includes(userDomain)
          })
        }

        const competitorsSeen: { name: string; domain?: string }[] = []
        const seenDomains = new Set<string>()

        for (const chunk of chunks as { web?: { uri?: string; title?: string } }[]) {
          const uri = chunk.web?.uri ?? ''
          const title = chunk.web?.title ?? ''
          const domain = domainOf(uri)

          if (!domain && !title) continue
          // Skip user's own domain
          if (domain && userDomain && (domain === userDomain || domain.includes(userDomain) || userDomain.includes(domain))) continue
          // Skip duplicates
          const dedupeKey = domain ?? norm(title)
          if (seenDomains.has(dedupeKey)) continue
          seenDomains.add(dedupeKey)

          const displayName = title ? cleanTitle(title, domain ?? title) : (domain ?? title)
          competitorsSeen.push({ name: displayName, domain })

          // Accumulate in global map
          const existing = competitorMap.get(dedupeKey)
          if (existing) {
            existing.appearances += 1
          } else {
            competitorMap.set(dedupeKey, { name: displayName, domain, appearances: 1 })
          }
        }

        return { question, appeared, competitorsSeen, citedUrls: chunks.map((c: { web?: { uri?: string } }) => c.web?.uri ?? '').filter(Boolean) }
      } catch {
        return { question, appeared: false, competitorsSeen: [], citedUrls: [] }
      }
    })
  )

  const appearedInCount = questionResults.filter(r => r.appeared).length
  const totalQuestions = questionResults.length
  const visibilityRate = totalQuestions > 0 ? Math.round((appearedInCount / totalQuestions) * 100) : 0

  const topCompetitors = Array.from(competitorMap.values())
    .sort((a, b) => b.appearances - a.appearances)
    .slice(0, 5)

  return { appearedInCount, totalQuestions, visibilityRate, questionResults, topCompetitors }
}
