export interface ScanFormData {
  businessName: string
  websiteUrl: string
  city: string
  primaryService: string
  competitors: string
  honeypot?: string   // must be empty — bot trap
}

export interface CategoryScores {
  aiRecommendationVisibility: number   // Gemini-measured, 0–100
  localAuthority: number
  citationTrustSignals: number
  contentCoverage: number
  technicalTrustReadiness: number
}

export interface CompetitorData {
  name: string
  score: number       // Gemini appearance rate 0–100, or overall score if Gemini failed
  domain?: string
  appearances?: number  // raw count out of totalQuestions
  isUser?: boolean
}

export interface Insight {
  id: string
  platform: 'chatgpt' | 'gemini' | 'perplexity' | 'google-ai' | 'local'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
}

export interface Problem {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  category: string
}

export interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'easy' | 'medium' | 'hard'
  category: string
}

export interface QuickWin {
  id: string
  title: string
  description: string
  timeEstimate: string
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface GeminiQuestionResult {
  question: string
  appeared: boolean
  competitorsSeen: { name: string; domain?: string }[]
  citedUrls: string[]
}

export interface GeminiVisibilityResult {
  appearedInCount: number
  totalQuestions: number
  visibilityRate: number
  questionResults: GeminiQuestionResult[]
  topCompetitors: { name: string; domain?: string; appearances: number }[]
  error?: string
}

export interface ScanResult {
  id: string
  businessName: string
  websiteUrl: string
  city: string
  primaryService: string
  competitors: string[]
  overallScore: number
  categories: CategoryScores
  insights: Insight[]
  problems: Problem[]
  recommendations: Recommendation[]
  quickWins: QuickWin[]
  competitorComparison: CompetitorData[]
  grade: Grade
  createdAt: string
  scanMethod: 'real' | 'partial' | 'url-only'
  geminiVisibility?: GeminiVisibilityResult
}

export interface SavedReport {
  id: string
  businessName: string
  websiteUrl: string
  overallScore: number
  grade: Grade
  city: string
  primaryService: string
  createdAt: string
}
