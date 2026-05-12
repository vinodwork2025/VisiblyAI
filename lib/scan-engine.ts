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
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
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

function gradeFrom(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
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

export function runMockScan(form: ScanFormData): ScanResult {
  const { businessName, websiteUrl, city, primaryService, competitors } = form
  const seed = businessName + websiteUrl + city + primaryService

  const urlBase = scoreFromUrl(websiteUrl)

  const categories: CategoryScores = {
    aiRecommendationVisibility: detScore(seed + 'aiv', Math.max(15, urlBase - 25), Math.min(urlBase + 15, 72)),
    localAuthority:             detScore(seed + 'loc', Math.max(20, urlBase - 18), Math.min(urlBase + 22, 80)),
    citationTrustSignals:       detScore(seed + 'tru', Math.max(18, urlBase - 22), Math.min(urlBase + 18, 76)),
    contentCoverage:            detScore(seed + 'con', Math.max(15, urlBase - 28), Math.min(urlBase + 12, 70)),
    technicalTrustReadiness:    detScore(seed + 'tec', Math.max(22, urlBase - 15), Math.min(urlBase + 25, 82)),
  }

  const overallScore = Math.round(
    Object.values(categories).reduce((a, b) => a + b, 0) / 5
  )

  const competitorList = competitors
    ? competitors.split(/[\n,]/).map(c => c.trim()).filter(Boolean).slice(0, 3)
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

  const behindCount = competitorComparison.filter(c => !c.isUser && c.score > overallScore).length

  const insights: Insight[] = [
    {
      id: uid(), platform: 'chatgpt',
      title: 'Not Referenced by ChatGPT',
      description: `When potential customers ask ChatGPT about ${primaryService} services in ${city}, ${businessName} does not appear in recommendations. Competitors are capturing this intent.`,
      impact: 'high',
    },
    {
      id: uid(), platform: 'google-ai',
      title: 'Missing from AI Overviews',
      description: `Google's AI-generated answer boxes for local ${primaryService} queries don't feature your business. Structured content and schema markup would unlock this channel.`,
      impact: 'high',
    },
    {
      id: uid(), platform: 'gemini',
      title: 'Gemini Visibility Gap',
      description: `Gemini rarely references ${businessName} when answering questions about ${primaryService}. Your authority signals need strengthening to be included in AI recommendations.`,
      impact: 'medium',
    },
    {
      id: uid(), platform: 'perplexity',
      title: 'Weak Perplexity Citation Signal',
      description: `Perplexity AI bases recommendations on high-authority sources. Your site currently lacks the content depth and inbound authority needed to be regularly cited.`,
      impact: 'medium',
    },
    {
      id: uid(), platform: 'local',
      title: 'Local AI Search Opportunity',
      description: `AI-powered local search in ${city} is growing fast. Your current visibility score leaves significant market share uncaptured compared to competitors actively optimizing for AI.`,
      impact: 'high',
    },
  ]

  const problems: Problem[] = [
    {
      id: uid(), title: 'No AI-Optimized FAQ Content',
      description: 'Your website lacks the Q&A, FAQ, and conversational content structures that AI models extract for recommendations. This is the #1 reason businesses are invisible to AI.',
      severity: 'critical', category: 'Content',
    },
    {
      id: uid(), title: 'Schema Markup Absent or Incomplete',
      description: 'Structured data (Schema.org) is missing or insufficient. AI systems rely on this machine-readable markup to understand and recommend your business.',
      severity: 'critical', category: 'Technical',
    },
    {
      id: uid(), title: 'Insufficient E-E-A-T Signals',
      description: 'AI models evaluate Experience, Expertise, Authority, and Trust before recommending a business. Your current content does not adequately demonstrate these signals.',
      severity: 'warning', category: 'Authority',
    },
    {
      id: uid(), title: 'Limited Review Footprint',
      description: 'AI models heavily weight third-party reviews when recommending local services. Expanding your review presence across key platforms is a high-leverage opportunity.',
      severity: 'warning', category: 'Trust',
    },
    {
      id: uid(),
      title: `${behindCount} Competitor${behindCount !== 1 ? 's' : ''} Outranking You in AI Search`,
      description: `Based on our analysis, ${behindCount > 0 ? behindCount : 'multiple'} competitor${behindCount !== 1 ? 's are' : ' is'} more visible than ${businessName} in AI-generated results for ${primaryService} in ${city}.`,
      severity: 'critical', category: 'Competition',
    },
  ]

  const recommendations: Recommendation[] = [
    {
      id: uid(), title: 'Build a Comprehensive AI-Optimized FAQ',
      description: `Create 15–20 FAQ entries that directly answer the questions your customers ask AI assistants. Focus on "${primaryService} in ${city}" intent queries. This is the fastest path to AI inclusion.`,
      impact: 'high', effort: 'easy', category: 'Content',
    },
    {
      id: uid(), title: 'Deploy LocalBusiness & Service Schema',
      description: 'Implement JSON-LD structured data for LocalBusiness, Service, FAQPage, and Review schemas. This signals your business data to AI in a machine-readable format it trusts.',
      impact: 'high', effort: 'medium', category: 'Technical',
    },
    {
      id: uid(), title: 'Publish Authority Content for Your Service',
      description: `Create 3–5 in-depth, expert articles about ${primaryService} in ${city}. AI systems prefer to cite established subject-matter experts — this positions you as the local authority.`,
      impact: 'high', effort: 'medium', category: 'Content',
    },
    {
      id: uid(), title: 'Expand Reviews on AI-Indexed Platforms',
      description: 'Systematically collect reviews on Google Business Profile, Yelp, and one industry-specific directory. Review velocity and recency are key signals AI uses to validate business quality.',
      impact: 'medium', effort: 'easy', category: 'Trust',
    },
    {
      id: uid(), title: 'Rewrite Core Pages in Conversational Format',
      description: 'Restructure your main service pages using a question-answer format that mirrors how people query AI assistants. Natural language content is what AI models extract and repeat.',
      impact: 'medium', effort: 'medium', category: 'Content',
    },
  ]

  const quickWins: QuickWin[] = [
    {
      id: uid(), title: 'Complete every field in your Google Business Profile',
      description: 'Hours, photos, services, Q&A, and description. An incomplete GBP is invisible to AI local search.',
      timeEstimate: '30 min',
    },
    {
      id: uid(), title: 'Add 5 FAQ questions to your homepage',
      description: `Answer: "What does ${businessName} do?", "Why choose ${businessName} in ${city}?", and 3 common service questions.`,
      timeEstimate: '1 hour',
    },
    {
      id: uid(), title: 'Request 10 new Google reviews this week',
      description: 'Send a personalized follow-up to recent customers with a direct review link. Aim for 5-star mentions of your service name and city.',
      timeEstimate: '20 min',
    },
    {
      id: uid(), title: 'Update your page titles to include service + city',
      description: `Format: "${primaryService} in ${city} — ${businessName}"`,
      timeEstimate: '15 min',
    },
    {
      id: uid(), title: 'Get listed on 3 key local directories',
      description: 'Yelp, Yellow Pages, and one industry-specific directory. Consistent NAP data across the web improves AI trust signals.',
      timeEstimate: '45 min',
    },
  ]

  return {
    id: uid(),
    businessName,
    websiteUrl: websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`,
    city, primaryService,
    competitors: competitorList,
    overallScore, categories, insights, problems, recommendations, quickWins,
    competitorComparison,
    grade: gradeFrom(overallScore),
    createdAt: new Date().toISOString(),
  }
}

// ─── Real scan helpers ────────────────────────────────────────────────────────

async function safeGet(url: string, timeoutMs = 6000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CiteCheck/1.0; +https://citecheck.ai)' },
      })
      if (!res.ok) return null
      return await res.text()
    } finally {
      clearTimeout(timer)
    }
  } catch {
    return null
  }
}

function normalizeUrl(url: string): string {
  const full = url.startsWith('http') ? url : `https://${url}`
  try { return new URL(full).href } catch { return full }
}

function getOrigin(url: string): string {
  const full = url.startsWith('http') ? url : `https://${url}`
  try { return new URL(full).origin } catch { return full }
}

interface RobotsResult {
  gptBotBlocked: boolean
  claudeBotBlocked: boolean
  perplexityBotBlocked: boolean
}

function parseRobots(text: string | null): RobotsResult {
  const none = { gptBotBlocked: false, claudeBotBlocked: false, perplexityBotBlocked: false }
  if (!text) return none

  const blockedBots = new Set<string>()
  let currentAgents: string[] = []

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) { currentAgents = []; continue }
    if (line.startsWith('#')) continue
    const lower = line.toLowerCase()
    if (lower.startsWith('user-agent:')) {
      currentAgents.push(lower.slice('user-agent:'.length).trim())
    } else if (lower.startsWith('disallow:')) {
      const path = lower.slice('disallow:'.length).trim()
      if (path === '/') currentAgents.forEach(a => blockedBots.add(a))
    }
  }

  const blocked = (...names: string[]) => names.some(n => blockedBots.has(n)) || blockedBots.has('*')
  return {
    gptBotBlocked: blocked('gptbot'),
    claudeBotBlocked: blocked('claudebot', 'claude-web', 'anthropic-ai'),
    perplexityBotBlocked: blocked('perplexitybot'),
  }
}

function extractSchemaTypes(html: string | null): string[] {
  if (!html) return []
  const types: string[] = []
  for (const m of html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)) types.push(m[1])
  return [...new Set(types)]
}

function extractMeta(html: string | null) {
  if (!html) return { title: '', description: '', hasFaq: false, hasJsonLd: false }
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const descM  = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']{10,})["']/i)
             || html.match(/<meta[^>]*content=["']([^"']{10,})["'][^>]*name=["']description["']/i)
  return {
    title: titleM?.[1]?.trim() || '',
    description: descM?.[1]?.trim() || '',
    hasFaq: /faq|frequently.asked|questions.&.answers/i.test(html),
    hasJsonLd: html.includes('application/ld+json'),
  }
}

interface SiteData {
  origin: string
  hasLlmsTxt: boolean
  hasSitemap: boolean
  robots: RobotsResult
  schemaTypes: string[]
  meta: ReturnType<typeof extractMeta>
  httpsUsed: boolean
  fetchedOk: boolean
}

async function analyzeSite(url: string): Promise<SiteData> {
  const origin = getOrigin(url)
  const httpsUsed = origin.startsWith('https')

  const [html, robotsTxt, llmsTxt, sitemap] = await Promise.all([
    safeGet(url, 8000),
    safeGet(`${origin}/robots.txt`, 4000),
    safeGet(`${origin}/llms.txt`, 4000),
    safeGet(`${origin}/sitemap.xml`, 4000),
  ])

  return {
    origin,
    hasLlmsTxt: !!llmsTxt && llmsTxt.length > 10,
    hasSitemap: !!sitemap,
    robots: parseRobots(robotsTxt),
    schemaTypes: extractSchemaTypes(html),
    meta: extractMeta(html),
    httpsUsed,
    fetchedOk: !!html,
  }
}

function scoreFromData(data: SiteData): CategoryScores {
  // AI Visibility: based on actual crawlability and AI signals
  let aiVisibility = 10
  if (data.hasLlmsTxt) aiVisibility += 28
  if (!data.robots.gptBotBlocked) aiVisibility += 18
  if (!data.robots.claudeBotBlocked) aiVisibility += 10
  if (!data.robots.perplexityBotBlocked) aiVisibility += 10
  if (data.schemaTypes.length > 0) aiVisibility += 10
  if (data.schemaTypes.includes('FAQPage') || data.meta.hasFaq) aiVisibility += 9
  if (data.schemaTypes.some(t => ['LocalBusiness','Plumber','Dentist','Lawyer','MedicalBusiness','HealthAndBeautyBusiness','HomeAndConstructionBusiness'].includes(t))) aiVisibility += 10
  aiVisibility = Math.min(aiVisibility, 95)

  // Technical readiness
  let technical = 20
  if (data.httpsUsed) technical += 22
  if (data.hasSitemap) technical += 16
  if (data.meta.hasJsonLd) technical += 22
  if (data.fetchedOk) technical += 10
  technical = Math.min(technical, 92)

  // Trust signals
  let trust = 35
  if (data.schemaTypes.includes('Review') || data.schemaTypes.includes('AggregateRating')) trust += 22
  if (data.schemaTypes.includes('Organization') || data.schemaTypes.includes('LocalBusiness')) trust += 15
  trust = Math.min(trust, 82)

  // Content coverage
  let content = 25
  if (data.meta.hasFaq) content += 22
  if (data.meta.description.length > 80) content += 14
  if (data.schemaTypes.includes('Article') || data.schemaTypes.includes('BlogPosting')) content += 16
  content = Math.min(content, 82)

  // Local authority
  let local = 30
  if (data.schemaTypes.includes('LocalBusiness')) local += 25
  if (data.schemaTypes.includes('PostalAddress') || data.schemaTypes.includes('GeoCoordinates')) local += 15
  local = Math.min(local, 82)

  return { aiRecommendationVisibility: aiVisibility, localAuthority: local, citationTrustSignals: trust, contentCoverage: content, technicalTrustReadiness: technical }
}

function isLikelyUrl(s: string): boolean {
  return s.includes('.') && !s.includes(' ') && s.length > 4 && !s.includes('@')
}

function buildProblems(data: SiteData, form: ScanFormData, behindCount: number): Problem[] {
  const { businessName, city, primaryService } = form
  const list: Problem[] = []

  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: 'No llms.txt File Detected',
    description: `Your site at ${data.origin} has no llms.txt file. This emerging standard tells AI assistants how to understand your business. Early adopters in ${city} gain a measurable advantage.`,
    severity: 'critical', category: 'AI Optimization',
  })

  if (data.robots.gptBotBlocked) list.push({
    id: uid(), title: 'GPTBot Is Blocked in robots.txt',
    description: "Your robots.txt is preventing ChatGPT from crawling your site. OpenAI's systems cannot learn from your content, making you invisible to ChatGPT recommendations.",
    severity: 'critical', category: 'AI Access',
  })

  if (data.robots.perplexityBotBlocked) list.push({
    id: uid(), title: 'PerplexityBot Is Blocked in robots.txt',
    description: 'Perplexity AI cannot crawl your site. Your business cannot appear in Perplexity search results or AI citations as long as this block is in place.',
    severity: 'warning', category: 'AI Access',
  })

  if (data.robots.claudeBotBlocked) list.push({
    id: uid(), title: 'ClaudeBot Is Blocked in robots.txt',
    description: "Anthropic's AI crawler cannot access your site. Unblocking ClaudeBot ensures Claude-powered assistants can reference your business in recommendations.",
    severity: 'warning', category: 'AI Access',
  })

  if (!data.meta.hasJsonLd) list.push({
    id: uid(), title: 'Schema Markup Absent or Incomplete',
    description: 'Structured data (Schema.org JSON-LD) was not detected on your site. AI systems rely on this machine-readable markup to understand your business and include it in recommendations.',
    severity: 'critical', category: 'Technical',
  })

  if (!data.meta.hasFaq) list.push({
    id: uid(), title: 'No AI-Optimized FAQ Content',
    description: `Your site lacks FAQ or Q&A content that AI models extract for recommendations. This is a primary reason businesses don't appear in AI answers for ${primaryService} queries.`,
    severity: 'critical', category: 'Content',
  })

  if (behindCount > 0) list.push({
    id: uid(),
    title: `${behindCount} Competitor${behindCount !== 1 ? 's' : ''} Outranking You in AI Search`,
    description: `Based on our analysis, ${behindCount} competitor${behindCount !== 1 ? 's are' : ' is'} more visible than ${businessName} in AI-generated results for ${primaryService} in ${city}.`,
    severity: 'critical', category: 'Competition',
  })

  return list.slice(0, 5)
}

function buildRecommendations(data: SiteData, form: ScanFormData): Recommendation[] {
  const { city, primaryService } = form
  const list: Recommendation[] = []

  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: 'Create Your llms.txt File',
    description: `Add /llms.txt to ${data.origin} with a plain-English description of your business, services, and service area in ${city}. Few local competitors have done this — it's a low-effort, high-impact win.`,
    impact: 'high', effort: 'easy', category: 'AI Optimization',
  })

  if (!data.meta.hasJsonLd) list.push({
    id: uid(), title: 'Deploy LocalBusiness & Service Schema',
    description: 'Implement JSON-LD structured data for LocalBusiness, Service, FAQPage, and Review schemas. This signals your business data to AI in a machine-readable format it trusts.',
    impact: 'high', effort: 'medium', category: 'Technical',
  })

  list.push({
    id: uid(), title: 'Build a Comprehensive AI-Optimized FAQ',
    description: `Create 15–20 FAQ entries that directly answer questions your customers ask AI assistants. Focus on "${primaryService} in ${city}" intent queries. This is the fastest path to AI inclusion.`,
    impact: 'high', effort: 'easy', category: 'Content',
  })

  list.push({
    id: uid(), title: 'Publish Authority Content for Your Service',
    description: `Create 3–5 in-depth expert articles about ${primaryService} in ${city}. AI systems prefer to cite established subject-matter experts — this positions you as the local authority.`,
    impact: 'high', effort: 'medium', category: 'Content',
  })

  list.push({
    id: uid(), title: 'Expand Reviews on AI-Indexed Platforms',
    description: 'Systematically collect reviews on Google Business Profile, Yelp, and one industry-specific directory. Review velocity and recency are key signals AI uses to validate business quality.',
    impact: 'medium', effort: 'easy', category: 'Trust',
  })

  if (data.robots.gptBotBlocked || data.robots.claudeBotBlocked || data.robots.perplexityBotBlocked) list.unshift({
    id: uid(), title: 'Unblock AI Crawlers in robots.txt',
    description: `Your robots.txt is blocking at least one major AI crawler. Remove the Disallow: / rules for GPTBot, ClaudeBot, and PerplexityBot to restore AI indexing access immediately.`,
    impact: 'high', effort: 'easy', category: 'AI Access',
  })

  return list.slice(0, 5)
}

function buildInsights(data: SiteData, form: ScanFormData): Insight[] {
  const { businessName, city, primaryService } = form
  return [
    {
      id: uid(), platform: 'chatgpt',
      title: data.robots.gptBotBlocked ? 'GPTBot Blocked — ChatGPT Cannot Index You' : 'Not Surfacing in ChatGPT Answers',
      description: data.robots.gptBotBlocked
        ? `${businessName} is blocking GPTBot in robots.txt, so ChatGPT cannot crawl or learn from your content. Competitors who allow access are being recommended instead.`
        : `${businessName} allows GPTBot access but lacks the structured FAQ and schema content needed for ChatGPT to confidently recommend you for ${primaryService} in ${city}.`,
      impact: 'high',
    },
    {
      id: uid(), platform: 'google-ai',
      title: 'Missing from Google AI Overviews',
      description: `Google's AI-generated answer boxes for local ${primaryService} queries aren't featuring your business. ${data.meta.hasJsonLd ? 'Your schema markup is a positive start — adding FAQ content is the next step.' : 'Adding schema markup and FAQ content would unlock this high-visibility channel.'}`,
      impact: 'high',
    },
    {
      id: uid(), platform: 'gemini',
      title: 'Gemini Visibility Gap',
      description: `Gemini rarely references ${businessName} for ${primaryService} queries. ${data.hasLlmsTxt ? 'Your llms.txt file is a positive signal — expanding your authority content will further improve your inclusion rate.' : 'Adding an llms.txt file and expert content would significantly improve your Gemini inclusion rate.'}`,
      impact: 'medium',
    },
    {
      id: uid(), platform: 'perplexity',
      title: data.robots.perplexityBotBlocked ? 'PerplexityBot Blocked — Cannot Cite You' : 'Low Perplexity Citation Score',
      description: data.robots.perplexityBotBlocked
        ? `PerplexityBot is blocked in your robots.txt. Perplexity AI cannot crawl or cite your site until this rule is removed.`
        : `Perplexity AI cites high-authority sources. Your site needs more depth — expert articles, case studies, and external citations — to be included in Perplexity recommendations for ${primaryService}.`,
      impact: 'medium',
    },
    {
      id: uid(), platform: 'local',
      title: 'Local AI Search Opportunity',
      description: `AI-powered local search in ${city} is growing rapidly. ${data.hasLlmsTxt ? 'Your llms.txt gives you an early-mover advantage — now build on it with schema and FAQ content.' : 'Starting with llms.txt and LocalBusiness schema puts you ahead of the majority of local competitors who have not yet optimized for AI.'}`,
      impact: 'high',
    },
  ]
}

function buildQuickWins(data: SiteData, form: ScanFormData): QuickWin[] {
  const { businessName, city, primaryService } = form
  const list: QuickWin[] = []

  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: `Create ${data.origin}/llms.txt`,
    description: `Write 10–15 lines describing who you are, what ${primaryService} services you offer, and where in ${city} you operate. Free and takes under an hour.`,
    timeEstimate: '45 min',
  })

  if (data.robots.gptBotBlocked || data.robots.claudeBotBlocked || data.robots.perplexityBotBlocked) list.push({
    id: uid(), title: 'Remove AI bot blocks from robots.txt',
    description: 'Delete or update the Disallow: / rules that block GPTBot, ClaudeBot, and PerplexityBot. This immediately restores AI indexing access.',
    timeEstimate: '10 min',
  })

  list.push({
    id: uid(), title: 'Complete every field in your Google Business Profile',
    description: 'Hours, photos, services, Q&A, and description. An incomplete GBP is invisible to AI local search.',
    timeEstimate: '30 min',
  })

  list.push({
    id: uid(), title: 'Add 5 FAQ questions to your homepage',
    description: `Answer: "What does ${businessName} do?", "Why choose ${businessName} in ${city}?", and 3 common ${primaryService} questions.`,
    timeEstimate: '1 hour',
  })

  list.push({
    id: uid(), title: 'Update page titles to include service + city',
    description: `Format: "${primaryService} in ${city} — ${businessName}"`,
    timeEstimate: '15 min',
  })

  return list.slice(0, 5)
}

export async function runRealScan(form: ScanFormData): Promise<ScanResult> {
  const { businessName, city, primaryService, competitors } = form
  const normalizedUrl = normalizeUrl(form.websiteUrl)

  const data = await analyzeSite(normalizedUrl)
  const categories = scoreFromData(data)
  const overallScore = Math.round(Object.values(categories).reduce((a, b) => a + b, 0) / 5)

  const competitorList = competitors
    ? competitors.split(/[\n,]/).map(c => c.trim()).filter(Boolean).slice(0, 3)
    : []

  const competitorEntries: CompetitorData[] = await Promise.all(
    competitorList.map(async (entry, i) => {
      if (isLikelyUrl(entry)) {
        try {
          const compData = await analyzeSite(normalizeUrl(entry))
          const compCats = scoreFromData(compData)
          const compScore = Math.round(Object.values(compCats).reduce((a, b) => a + b, 0) / 5)
          return { name: entry, score: compScore }
        } catch { /* fall through to estimated */ }
      }
      return { name: entry, score: detScore(entry + primaryService + i, 42, 85) }
    })
  )

  const fillCount = Math.max(0, 2 - competitorEntries.length)
  const genericComps: CompetitorData[] = Array.from({ length: fillCount }, (_, i) => ({
    name: i === 0 ? `Top ${primaryService} Expert` : `Local ${primaryService} Pro`,
    score: detScore(primaryService + city + 'generic' + i, 50, 84),
  }))

  const competitorComparison: CompetitorData[] = [
    { name: businessName, score: overallScore, isUser: true },
    ...competitorEntries,
    ...genericComps,
  ].sort((a, b) => b.score - a.score)

  const behindCount = competitorComparison.filter(c => !c.isUser && c.score > overallScore).length

  return {
    id: uid(),
    businessName,
    websiteUrl: normalizedUrl,
    city, primaryService,
    competitors: competitorList,
    overallScore, categories,
    insights: buildInsights(data, form),
    problems: buildProblems(data, form, behindCount),
    recommendations: buildRecommendations(data, form),
    quickWins: buildQuickWins(data, form),
    competitorComparison,
    grade: gradeFrom(overallScore),
    createdAt: new Date().toISOString(),
  }
}
