// Shared TypeScript types for the Court Case Prioritization System

export interface CaseInput {
  case_id: string
  summary: string
  ipc_section: string
  detention_duration: number
  expected_sentence: number
  age: number
  gender: string
}

export interface CaseResult {
  case_id: string
  summary: string
  ipc_section: string
  detention_duration: number
  expected_sentence: number
  age: number
  gender: string
  classification: string
  priority_score: number
  flag: string | null
  explanation: string[]
}

export interface CasesResponse {
  total: number
  cases: CaseResult[]
}

export type UserRole = 'Admin' | 'Judge'

export interface AuthUser {
  email: string
  role: UserRole
  name: string
}
