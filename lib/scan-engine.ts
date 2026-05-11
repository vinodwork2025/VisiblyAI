import type {
  ScanFormData,
  ScanResult,
  CategoryScores,
  Insight,
  Problem,
  Recommendation,
  QuickWin,
  CompetitorData,
  Grade,
} from '@/types'

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function hash(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i)
    h = h >>> 0
  }
  return h
}

function detScore(seed: string, min: number, max: number): number {
  return min + (hash(seed) % (max - min + 1))
}

function scoreFromUrl(url: string): number {
  let s = 48
  try {
    const full = url.startsWith('http') ? url : `https://${url}`
    const u = new URL(full)
    if (u.protocol === 'https:') s += 5
    const host = u.hostname.replace(/^www\./, '')
    if (host.endsWith('.com')) s += 4
    else if (host.endsWith('.co') || host.endsWith('.io')) s += 2
    const name = host.split('.')[0]
    if (name.length <= 8) s += 3
    if (name.length > 20) s -= 4
    if (u.hostname.split('.').length > 3) s -= 3
  } catch {
    s -= 5
  }
  return Math.min(Math.max(s, 25), 72)
}

function gradeFrom(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

export function runMockScan(form: ScanFormData): ScanResult {
  const { businessName, websiteUrl, city, primaryService, competitors } = form
  const seed = businessName + websiteUrl + city + primaryService

  const urlBase = scoreFromUrl(websiteUrl)

  const categories: CategoryScores = {
    aiVisibility:        detScore(seed + 'aiv', Math.max(15, urlBase - 25), Math.min(urlBase + 15, 72)),
    localAuthority:      detScore(seed + 'loc', Math.max(20, urlBase - 18), Math.min(urlBase + 22, 80)),
    trustSignals:        detScore(seed + 'tru', Math.max(18, urlBase - 22), Math.min(urlBase + 18, 76)),
    contentCoverage:     detScore(seed + 'con', Math.max(15, urlBase - 28), Math.min(urlBase + 12, 70)),
    technicalReadiness:  detScore(seed + 'tec', Math.max(22, urlBase - 15), Math.min(urlBase + 25, 82)),
  }

  const overallScore = Math.round(
    Object.values(categories).reduce((a, b) => a + b, 0) / 5
  )

  const competitorList = competitors
    ? competitors.split(',').map(c => c.trim()).filter(Boolean).slice(0, 3)
    : []

  const userEntry: CompetitorData = { name: businessName, score: overallScore, isUser: true }

  const namedComps: CompetitorData[] = competitorList.map((name, i) => ({
    name,
    score: detScore(name + seed + i, 42, 85),
  }))

  const fillCount = Math.max(0, 2 - namedComps.length)
  const genericComps: CompetitorData[] = Array.from({ length: fillCount }, (_, i) => ({
    name: i === 0 ? `Top ${primaryService} Expert` : `Local ${primaryService} Pro`,
    score: detScore(seed + 'generic' + i, 50, 84),
  }))

  const competitorComparison: CompetitorData[] = [
    userEntry,
    ...namedComps,
    ...genericComps,
  ].sort((a, b) => b.score - a.score)

  const insights: Insight[] = [
    {
      id: uid(),
      platform: 'chatgpt',
      title: 'Not Referenced by ChatGPT',
      description: `When potential customers ask ChatGPT about ${primaryService} services in ${city}, ${businessName} does not appear in recommendations. Competitors are capturing this intent.`,
      impact: 'high',
    },
    {
      id: uid(),
      platform: 'google-ai',
      title: 'Missing from AI Overviews',
      description: `Google's AI-generated answer boxes for local ${primaryService} queries don't feature your business. Structured content and schema markup would unlock this channel.`,
      impact: 'high',
    },
    {
      id: uid(),
      platform: 'gemini',
      title: 'Gemini Visibility Gap',
      description: `Gemini rarely references ${businessName} when answering questions about ${primaryService}. Your authority signals need strengthening to be included in AI recommendations.`,
      impact: 'medium',
    },
    {
      id: uid(),
      platform: 'perplexity',
      title: 'Weak Perplexity Citation Signal',
      description: `Perplexity AI bases recommendations on high-authority sources. Your site currently lacks the content depth and inbound authority needed to be regularly cited.`,
      impact: 'medium',
    },
    {
      id: uid(),
      platform: 'local',
      title: 'Local AI Search Opportunity',
      description: `AI-powered local search in ${city} is growing fast. Your current visibility score leaves significant market share uncaptured compared to competitors actively optimizing for AI.`,
      impact: 'high',
    },
  ]

  const behindCount = competitorComparison.filter(c => !c.isUser && c.score > overallScore).length

  const problems: Problem[] = [
    {
      id: uid(),
      title: 'No AI-Optimized FAQ Content',
      description: 'Your website lacks the Q&A, FAQ, and conversational content structures that AI models extract for recommendations. This is the #1 reason businesses are invisible to AI.',
      severity: 'critical',
      category: 'Content',
    },
    {
      id: uid(),
      title: 'Schema Markup Absent or Incomplete',
      description: 'Structured data (Schema.org) is missing or insufficient. AI systems rely on this machine-readable markup to understand and recommend your business.',
      severity: 'critical',
      category: 'Technical',
    },
    {
      id: uid(),
      title: 'Insufficient E-E-A-T Signals',
      description: 'AI models evaluate Experience, Expertise, Authority, and Trust before recommending a business. Your current content does not adequately demonstrate these signals.',
      severity: 'warning',
      category: 'Authority',
    },
    {
      id: uid(),
      title: 'Limited Review Footprint',
      description: 'AI models heavily weight third-party reviews when recommending local services. Expanding your review presence across key platforms is a high-leverage opportunity.',
      severity: 'warning',
      category: 'Trust',
    },
    {
      id: uid(),
      title: `${behindCount} Competitor${behindCount !== 1 ? 's' : ''} Outranking You in AI Search`,
      description: `Based on our analysis, ${behindCount > 0 ? behindCount : 'multiple'} competitor${behindCount !== 1 ? 's are' : ' is'} more visible than ${businessName} in AI-generated results for ${primaryService} in ${city}.`,
      severity: 'critical',
      category: 'Competition',
    },
  ]

  const recommendations: Recommendation[] = [
    {
      id: uid(),
      title: 'Build a Comprehensive AI-Optimized FAQ',
      description: `Create 15–20 FAQ entries that directly answer the questions your customers ask AI assistants. Focus on "${primaryService} in ${city}" intent queries. This is the fastest path to AI inclusion.`,
      impact: 'high',
      effort: 'easy',
      category: 'Content',
    },
    {
      id: uid(),
      title: 'Deploy LocalBusiness & Service Schema',
      description: 'Implement JSON-LD structured data for LocalBusiness, Service, FAQPage, and Review schemas. This signals your business data to AI in a machine-readable format it trusts.',
      impact: 'high',
      effort: 'medium',
      category: 'Technical',
    },
    {
      id: uid(),
      title: 'Publish Authority Content for Your Service',
      description: `Create 3–5 in-depth, expert articles about ${primaryService} in ${city}. AI systems prefer to cite established subject-matter experts — this positions you as the local authority.`,
      impact: 'high',
      effort: 'medium',
      category: 'Content',
    },
    {
      id: uid(),
      title: 'Expand Reviews on AI-Indexed Platforms',
      description: 'Systematically collect reviews on Google Business Profile, Yelp, and one industry-specific directory. Review velocity and recency are key signals AI uses to validate business quality.',
      impact: 'medium',
      effort: 'easy',
      category: 'Trust',
    },
    {
      id: uid(),
      title: 'Rewrite Core Pages in Conversational Format',
      description: 'Restructure your main service pages using a question-answer format that mirrors how people query AI assistants. Natural language content is what AI models extract and repeat.',
      impact: 'medium',
      effort: 'medium',
      category: 'Content',
    },
  ]

  const quickWins: QuickWin[] = [
    {
      id: uid(),
      title: 'Complete every field in your Google Business Profile',
      description: 'Hours, photos, services, Q&A, and description. An incomplete GBP is invisible to AI local search.',
      timeEstimate: '30 min',
    },
    {
      id: uid(),
      title: 'Add 5 FAQ questions to your homepage',
      description: `Answer: "What does ${businessName} do?", "Why choose ${businessName} in ${city}?", and 3 common service questions.`,
      timeEstimate: '1 hour',
    },
    {
      id: uid(),
      title: 'Request 10 new Google reviews this week',
      description: 'Send a personalized follow-up to recent customers with a direct review link. Aim for 5-star mentions of your service name and city.',
      timeEstimate: '20 min',
    },
    {
      id: uid(),
      title: 'Update your page titles to include service + city',
      description: `Format: "${primaryService} in ${city} — ${businessName}"`,
      timeEstimate: '15 min',
    },
    {
      id: uid(),
      title: 'Get listed on 3 key local directories',
      description: 'Yelp, Yellow Pages, and one industry-specific directory. Consistent NAP data across the web improves AI trust signals.',
      timeEstimate: '45 min',
    },
  ]

  return {
    id: uid(),
    businessName,
    websiteUrl: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`,
    city,
    primaryService,
    competitors: competitorList,
    overallScore,
    categories,
    insights,
    problems,
    recommendations,
    quickWins,
    competitorComparison,
    grade: gradeFrom(overallScore),
    createdAt: new Date().toISOString(),
  }
}
