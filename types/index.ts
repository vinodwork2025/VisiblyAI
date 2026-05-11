export interface ScanFormData {
  businessName: string
  websiteUrl: string
  city: string
  primaryService: string
  competitors: string
}

export interface CategoryScores {
  aiVisibility: number
  localAuthority: number
  trustSignals: number
  contentCoverage: number
  technicalReadiness: number
}

export interface CompetitorData {
  name: string
  score: number
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
