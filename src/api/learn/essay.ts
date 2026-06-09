import { http } from '@/http/http'
import type { EssayRecord } from './index'

export function correctEssay(data: { studentId: number; essayContent: string }) {
  return http.post<EssayRecord>('/app/learn/essay/correct', data)
}

export function getEssayRecords(studentId: number) {
  return http.get<EssayRecord[]>(`/app/learn/essay/records?studentId=${studentId}`)
}
