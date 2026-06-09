import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { QaRecord } from './index'

export function askQuestion(data: { studentId: number; questionText: string; questionImage?: string; referenceQuestionId?: number; subject?: string; grade?: string }) {
  return http.post<QaRecord>('/app/learn/qa/ask', data)
}

export function getQaRecord(id: number) {
  return http.get<QaRecord>(`/app/learn/qa/get/${id}`)
}

export function getQaHistory(params: PageParam & { studentId?: number; subject?: string }) {
  return http.get<PageResult<QaRecord>>('/app/learn/qa/history', params)
}
