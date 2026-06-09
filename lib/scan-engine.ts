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
import type { GeminiVisibilityResult } from '@/types'

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function gradeFrom(score: number): Grade {
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  if (score >= 50) return 'C'
  if (score >= 35) return 'D'
  return 'F'
}

// ─── Real site fetching helpers ───────────────────────────────────────────────

const UA = 'Mozilla/5.0 (compatible; VisiblyAI/1.0; +https://visiblyai.com)'

async function safeGet(url: string, timeoutMs = 6000): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    return await res.text()
  } catch {
    return null
  }
}

async function safeGetFull(url: string, timeoutMs = 8000): Promise<{ text: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs), headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    return { text: await res.text(), finalUrl: res.url }
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
  const empty = { title: '', description: '', hasFaq: false, hasJsonLd: false, hasViewport: false, hasOgTags: false, hasCanonical: false, wordCount: 0, hasH1: false, hasSocialLinks: false }
  if (!html) return empty
  const titleM = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const descM  = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']{10,})["']/i)
             || html.match(/<meta[^>]*content=["']([^"']{10,})["'][^>]*name=["']description["']/i)
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    title: titleM?.[1]?.trim() || '',
    description: descM?.[1]?.trim() || '',
    hasFaq: /faq|frequently.asked|questions.&.answers/i.test(html),
    hasJsonLd: html.includes('application/ld+json'),
    hasViewport: /<meta[^>]*name=["']viewport["']/i.test(html),
    hasOgTags: /property=["']og:/i.test(html),
    hasCanonical: /<link[^>]*rel=["']canonical["']/i.test(html),
    hasH1: /<h1[\s>]/i.test(html),
    hasSocialLinks: /(facebook\.com|twitter\.com|instagram\.com|linkedin\.com|youtube\.com)/i.test(html),
    wordCount: stripped ? stripped.split(' ').filter(w => w.length > 2).length : 0,
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
  fetchedSomething: boolean
}

async function analyzeSite(url: string): Promise<SiteData> {
  const inputOrigin = getOrigin(url)
  try {
    const homeResult = await safeGetFull(url)
    const resolvedOrigin = homeResult ? getOrigin(homeResult.finalUrl) : inputOrigin
    const httpsUsed = resolvedOrigin.startsWith('https')
    const html = homeResult?.text ?? null

    const [robotsTxt, llmsTxt, sitemap] = await Promise.all([
      safeGet(`${resolvedOrigin}/robots.txt`, 5000),
      safeGet(`${resolvedOrigin}/llms.txt`, 5000),
      safeGet(`${resolvedOrigin}/sitemap.xml`, 5000),
    ])

    return {
      origin: resolvedOrigin,
      hasLlmsTxt: !!llmsTxt && llmsTxt.length > 10,
      hasSitemap: !!sitemap,
      robots: parseRobots(robotsTxt),
      schemaTypes: extractSchemaTypes(html),
      meta: extractMeta(html),
      httpsUsed,
      fetchedOk: !!html,
      fetchedSomething: !!(html || robotsTxt || llmsTxt || sitemap),
    }
  } catch {
    return {
      origin: inputOrigin,
      hasLlmsTxt: false,
      hasSitemap: false,
      robots: { gptBotBlocked: false, claudeBotBlocked: false, perplexityBotBlocked: false },
      schemaTypes: [],
      meta: extractMeta(null),
      httpsUsed: inputOrigin.startsWith('https'),
      fetchedOk: false,
      fetchedSomething: false,
    }
  }
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function scoreFromData(data: SiteData, gemini?: GeminiVisibilityResult): CategoryScores {
  const { meta } = data

  // AI Recommendation Visibility — use Gemini measured rate when available.
  // If Gemini not available, score technical readiness as a proxy.
  let aiVisibility: number
  if (gemini && !gemini.error) {
    aiVisibility = gemini.visibilityRate
  } else {
    aiVisibility = 10
    if (data.hasLlmsTxt) aiVisibility += 28
    if (!data.robots.gptBotBlocked) aiVisibility += 18
    if (!data.robots.claudeBotBlocked) aiVisibility += 10
    if (!data.robots.perplexityBotBlocked) aiVisibility += 10
    if (data.schemaTypes.length > 0) aiVisibility += 10
    if (data.schemaTypes.includes('FAQPage') || meta.hasFaq) aiVisibility += 9
    if (data.schemaTypes.some(t => ['LocalBusiness','Plumber','Dentist','Lawyer','MedicalBusiness','HealthAndBeautyBusiness','HomeAndConstructionBusiness'].includes(t))) aiVisibility += 10
    aiVisibility = Math.min(aiVisibility, 95)
  }

  let technical = 20
  if (data.httpsUsed) technical += 22
  if (data.hasSitemap) technical += 12
  if (meta.hasJsonLd) technical += 18
  if (data.fetchedOk) technical += 8
  if (meta.hasViewport) technical += 7
  if (meta.hasCanonical) technical += 5
  technical = Math.min(technical, 92)

  let trust = 35
  if (data.schemaTypes.includes('Review') || data.schemaTypes.includes('AggregateRating')) trust += 22
  if (data.schemaTypes.includes('Organization') || data.schemaTypes.includes('LocalBusiness')) trust += 12
  if (meta.hasOgTags) trust += 6
  if (meta.hasSocialLinks) trust += 7
  trust = Math.min(trust, 82)

  let content = 20
  if (meta.hasFaq) content += 22
  if (meta.description.length > 80) content += 10
  if (meta.hasH1) content += 8
  if (meta.wordCount > 300) content += 8
  if (meta.wordCount > 800) content += 6
  if (data.schemaTypes.includes('Article') || data.schemaTypes.includes('BlogPosting')) content += 12
  content = Math.min(content, 82)

  let local = 30
  if (data.schemaTypes.includes('LocalBusiness')) local += 25
  if (data.schemaTypes.includes('PostalAddress') || data.schemaTypes.includes('GeoCoordinates')) local += 15
  local = Math.min(local, 82)

  return { aiRecommendationVisibility: aiVisibility, localAuthority: local, citationTrustSignals: trust, contentCoverage: content, technicalTrustReadiness: technical }
}

// ─── Honest content builders ──────────────────────────────────────────────────

function buildInsights(data: SiteData, form: ScanFormData, gemini?: GeminiVisibilityResult): Insight[] {
  const { businessName, city, primaryService } = form
  const insights: Insight[] = []

  // 1. Google AI / Gemini — MEASURED (we actually queried it)
  if (gemini && !gemini.error) {
    const { appearedInCount, totalQuestions } = gemini
    if (appearedInCount > 0) {
      insights.push({
        id: uid(), platform: 'gemini',
        title: `Appeared in ${appearedInCount} of ${totalQuestions} Google AI searches`,
        description: `Google AI (with live search grounding) mentioned ${businessName} in ${appearedInCount} out of ${totalQuestions} test queries for ${primaryService} in ${city}. ${appearedInCount < totalQuestions ? `In ${totalQuestions - appearedInCount} question${totalQuestions - appearedInCount > 1 ? 's' : ''}, other businesses appeared instead.` : 'You appeared in every measured query.'}`,
        impact: appearedInCount >= totalQuestions * 0.6 ? 'medium' : 'high',
      })
    } else {
      insights.push({
        id: uid(), platform: 'gemini',
        title: `Not mentioned in ${totalQuestions} Google AI searches`,
        description: `Google AI (with live web search) did not mention ${businessName} in any of ${totalQuestions} test queries for ${primaryService} in ${city}. ${gemini.topCompetitors.length > 0 ? `Other businesses appeared in results instead.` : `No local competitors were cited either — the service category may have limited AI search coverage in ${city}.`} This is a measurable visibility gap.`,
        impact: 'high',
      })
    }
  } else {
    // Gemini unavailable — honest about it
    insights.push({
      id: uid(), platform: 'gemini',
      title: 'Google AI visibility not yet measured',
      description: `Live Google AI query testing is not available in this scan. Your technical readiness signals (llms.txt: ${data.hasLlmsTxt ? 'present' : 'missing'}, schema: ${data.schemaTypes.length > 0 ? 'present' : 'missing'}) indicate how prepared your site is to be cited.`,
      impact: 'medium',
    })
  }

  // 2. ChatGPT — READINESS ONLY (we did not query ChatGPT)
  insights.push({
    id: uid(), platform: 'chatgpt',
    title: data.robots.gptBotBlocked
      ? 'GPTBot blocked — ChatGPT cannot crawl your site'
      : data.hasLlmsTxt
        ? 'ChatGPT crawl access confirmed, llms.txt present'
        : 'ChatGPT readiness: crawl access OK, structured context missing',
    description: data.robots.gptBotBlocked
      ? `Your robots.txt blocks GPTBot. OpenAI's crawler cannot read your site, so ChatGPT has no content to learn from and cannot recommend ${businessName}. Remove this block to restore access.`
      : data.hasLlmsTxt
        ? `GPTBot can access your site and you have an llms.txt file — both positive readiness signals for ChatGPT inclusion. Note: this scan measures technical readiness, not actual ChatGPT citation frequency.`
        : `GPTBot can access your site, but there is no llms.txt file. Adding /llms.txt helps ChatGPT and other AI systems understand your business context. This is a readiness assessment, not a measured citation check.`,
    impact: data.robots.gptBotBlocked ? 'high' : data.hasLlmsTxt ? 'low' : 'medium',
  })

  // 3. Perplexity — READINESS ONLY (we did not query Perplexity)
  insights.push({
    id: uid(), platform: 'perplexity',
    title: data.robots.perplexityBotBlocked
      ? 'PerplexityBot blocked — cannot be cited by Perplexity'
      : 'Perplexity readiness: crawl access confirmed',
    description: data.robots.perplexityBotBlocked
      ? `PerplexityBot is blocked in your robots.txt. Perplexity AI cannot crawl or cite ${businessName} until this rule is removed.`
      : `PerplexityBot can crawl your site. Perplexity citation frequency depends on content authority and inbound links — this scan measures technical access, not actual citation rates.`,
    impact: data.robots.perplexityBotBlocked ? 'high' : 'low',
  })

  // 4. Local AI opportunity
  insights.push({
    id: uid(), platform: 'local',
    title: 'Local AI search opportunity in ' + city,
    description: data.hasLlmsTxt
      ? `Your llms.txt gives you an early-mover advantage for local AI queries in ${city}. Add LocalBusiness schema and FAQ content to strengthen your position further.`
      : `AI-powered local search in ${city} is growing fast. An llms.txt file and LocalBusiness schema markup are the fastest steps to improve AI discoverability for ${primaryService} queries.`,
    impact: 'high',
  })

  return insights
}

function buildProblems(data: SiteData, form: ScanFormData, gemini?: GeminiVisibilityResult): Problem[] {
  const { businessName, city, primaryService } = form
  const list: Problem[] = []

  // Gemini-sourced problems
  if (gemini && !gemini.error && gemini.appearedInCount === 0) {
    list.push({
      id: uid(),
      title: `Not appearing in Google AI searches for ${primaryService} in ${city}`,
      description: `Measured: Google AI did not mention ${businessName} in ${gemini.totalQuestions} live queries.${gemini.topCompetitors.length > 0 ? ` Competitors appearing in your place: ${gemini.topCompetitors.slice(0, 3).map(c => c.name).join(', ')}.` : ''}`,
      severity: 'critical', category: 'AI Visibility',
    })
  } else if (gemini && !gemini.error && gemini.appearedInCount < gemini.totalQuestions) {
    const missed = gemini.totalQuestions - gemini.appearedInCount
    list.push({
      id: uid(),
      title: `Missed in ${missed} of ${gemini.totalQuestions} Google AI queries`,
      description: `Measured: ${businessName} appeared in ${gemini.appearedInCount} of ${gemini.totalQuestions} test queries for ${primaryService} in ${city}. In ${missed} queries, other businesses appeared instead.`,
      severity: 'warning', category: 'AI Visibility',
    })
  }

  // Technical problems — real findings
  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: 'No llms.txt file detected',
    description: `Your site has no llms.txt at ${data.origin}/llms.txt. This file tells AI assistants how to understand your business. Competitors who have it gain a measurable advantage in AI citations.`,
    severity: 'critical', category: 'AI Optimization',
  })

  if (data.robots.gptBotBlocked) list.push({
    id: uid(), title: 'GPTBot blocked in robots.txt',
    description: 'Your robots.txt prevents ChatGPT from crawling your site. OpenAI cannot learn from your content while this block is active.',
    severity: 'critical', category: 'AI Access',
  })

  if (data.robots.perplexityBotBlocked) list.push({
    id: uid(), title: 'PerplexityBot blocked in robots.txt',
    description: 'Perplexity AI cannot crawl your site. You cannot appear in Perplexity citations while this block is active.',
    severity: 'warning', category: 'AI Access',
  })

  if (data.robots.claudeBotBlocked) list.push({
    id: uid(), title: 'ClaudeBot blocked in robots.txt',
    description: "Anthropic's crawler cannot access your site. Unblocking it ensures Claude-powered assistants can reference your business.",
    severity: 'warning', category: 'AI Access',
  })

  if (!data.meta.hasJsonLd) list.push({
    id: uid(), title: 'No structured data (JSON-LD) detected',
    description: 'Schema.org markup was not found on your site. AI systems rely on structured data to understand your business and include it in recommendations.',
    severity: 'critical', category: 'Technical',
  })

  if (!data.meta.hasFaq) list.push({
    id: uid(), title: 'No FAQ content detected',
    description: `Your site lacks FAQ or Q&A content that AI models extract for recommendations. FAQ content is a primary signal for AI inclusion for ${primaryService} queries.`,
    severity: 'critical', category: 'Content',
  })

  return list.slice(0, 6)
}

function buildRecommendations(data: SiteData, form: ScanFormData): Recommendation[] {
  const { city, primaryService } = form
  const list: Recommendation[] = []

  if (data.robots.gptBotBlocked || data.robots.claudeBotBlocked || data.robots.perplexityBotBlocked) list.push({
    id: uid(), title: 'Unblock AI crawlers in robots.txt',
    description: 'Remove Disallow: / rules for GPTBot, ClaudeBot, and PerplexityBot. This immediately restores AI indexing access and is the highest-leverage 10-minute fix available.',
    impact: 'high', effort: 'easy', category: 'AI Access',
  })

  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: 'Create your llms.txt file',
    description: `Add /llms.txt to ${data.origin} with a plain-English description of your business, services, and location. Few competitors have done this — early adopters gain a lasting advantage.`,
    impact: 'high', effort: 'easy', category: 'AI Optimization',
  })

  if (!data.meta.hasJsonLd) list.push({
    id: uid(), title: 'Deploy LocalBusiness and Service schema',
    description: 'Add JSON-LD structured data for LocalBusiness, Service, FAQPage, and Review. AI systems use this machine-readable markup to understand and recommend your business.',
    impact: 'high', effort: 'medium', category: 'Technical',
  })

  list.push({
    id: uid(), title: 'Build an AI-optimised FAQ section',
    description: `Create 15–20 FAQ entries answering the questions your customers ask AI assistants. Focus on "${primaryService} in ${city}" intent. This is the fastest path to AI inclusion.`,
    impact: 'high', effort: 'easy', category: 'Content',
  })

  list.push({
    id: uid(), title: 'Publish authority content for your service',
    description: `Write 3–5 expert articles about ${primaryService} in ${city}. AI systems cite established subject-matter experts — this positions you as the local authority.`,
    impact: 'high', effort: 'medium', category: 'Content',
  })

  list.push({
    id: uid(), title: 'Expand reviews on AI-indexed platforms',
    description: 'Collect reviews on Google Business Profile, Yelp, and one industry-specific directory. Review velocity and recency are key signals AI systems use to validate business quality.',
    impact: 'medium', effort: 'easy', category: 'Trust',
  })

  return list.slice(0, 5)
}

function buildQuickWins(data: SiteData, form: ScanFormData): QuickWin[] {
  const { businessName, city, primaryService } = form
  const list: QuickWin[] = []

  if (!data.hasLlmsTxt) list.push({
    id: uid(), title: `Create ${data.origin}/llms.txt`,
    description: `Write 10–15 lines: who you are, what ${primaryService} services you offer, where in ${city} you operate. Free, takes under an hour, and gives you an early-mover advantage.`,
    timeEstimate: '45 min',
  })

  if (data.robots.gptBotBlocked || data.robots.claudeBotBlocked || data.robots.perplexityBotBlocked) list.push({
    id: uid(), title: 'Remove AI bot blocks from robots.txt',
    description: 'Delete or update the Disallow: / rules blocking GPTBot, ClaudeBot, and PerplexityBot. Immediately restores AI indexing access.',
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

function buildCompetitorComparison(
  businessName: string,
  overallScore: number,
  gemini?: GeminiVisibilityResult,
): CompetitorData[] {
  if (!gemini || gemini.error) {
    // No Gemini data — show only the user entry
    return [{ name: businessName, score: overallScore, isUser: true }]
  }

  const userEntry: CompetitorData = {
    name: businessName,
    score: gemini.visibilityRate,
    appearances: gemini.appearedInCount,
    isUser: true,
  }

  const competitorEntries: CompetitorData[] = gemini.topCompetitors.map(c => ({
    name: c.name,
    domain: c.domain,
    score: Math.round((c.appearances / gemini.totalQuestions) * 100),
    appearances: c.appearances,
  }))

  return [userEntry, ...competitorEntries].sort((a, b) => b.score - a.score)
}

// ─── Main exported scan function ─────────────────────────────────────────────

export async function runRealScan(form: ScanFormData, gemini?: GeminiVisibilityResult): Promise<ScanResult> {
  const { businessName, city, primaryService } = form
  const normalizedUrl = normalizeUrl(form.websiteUrl)

  const data = await analyzeSite(normalizedUrl)
  const scanMethod: 'real' | 'partial' | 'url-only' = data.fetchedOk ? 'real' : data.fetchedSomething ? 'partial' : 'url-only'

  const categories = scoreFromData(data, gemini)
  const overallScore = Math.round(Object.values(categories).reduce((a, b) => a + b, 0) / 5)

  return {
    id: uid(),
    businessName,
    websiteUrl: normalizedUrl,
    city,
    primaryService,
    competitors: [],
    overallScore,
    categories,
    insights: buildInsights(data, form, gemini),
    problems: buildProblems(data, form, gemini),
    recommendations: buildRecommendations(data, form),
    quickWins: buildQuickWins(data, form),
    competitorComparison: buildCompetitorComparison(businessName, overallScore, gemini),
    grade: gradeFrom(overallScore),
    createdAt: new Date().toISOString(),
    scanMethod,
    geminiVisibility: gemini,
  }
}
