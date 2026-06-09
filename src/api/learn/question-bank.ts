import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { QuestionBank } from './index'

export function getQuestionBankPage(params: PageParam & {
  subject?: string
  grade?: string
  questionType?: number
  difficulty?: number
  status?: number
  knowledgePointId?: number
  stem?: string
}) {
  return http.get<PageResult<QuestionBank>>('/learn/question-bank/page', params)
}

export function getQuestionBank(id: number) {
  return http.get<QuestionBank>(`/learn/question-bank/get?id=${id}`)
}

export function createQuestionBank(data: Partial<QuestionBank>) {
  return http.post<number>('/learn/question-bank/create', data)
}

export function updateQuestionBank(data: Partial<QuestionBank>) {
  return http.put<boolean>('/learn/question-bank/update', data)
}

export function deleteQuestionBank(id: number) {
  return http.delete<boolean>(`/learn/question-bank/delete?id=${id}`)
}

export function batchPublishQuestion(ids: number[]) {
  return http.post<boolean>('/learn/question-bank/batch-publish', { ids })
}

export function aiTagQuestion(id: number) {
  return http.post<string>(`/learn/question-bank/ai-tag/${id}`)
}

export function aiTagQuestionBatch(ids: number[]) {
  return http.post<boolean>('/learn/question-bank/ai-tag-batch', { ids })
}

export function aiGenerateQuestion(data: { subject: string; grade: string; count: number; difficulty?: number; questionType?: number }) {
  return http.post<QuestionBank[]>('/learn/question-bank/ai-generate', data)
}

export function aiCheckDuplicate(stem: string) {
  return http.get<QuestionBank[]>(`/learn/question-bank/ai-check-duplicate?stem=${encodeURIComponent(stem)}`)
}

export function aiVerifyAnswer(id: number) {
  return http.post<{ isCorrect: boolean; suggestion?: string }>(`/learn/question-bank/ai-verify-answer/${id}`)
}
