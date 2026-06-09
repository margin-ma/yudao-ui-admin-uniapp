import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { StudentKnowledgeStats, StudentQuestionRecord } from './index'

export function getKnowledgeStatsPage(params: PageParam & { studentId?: number; knowledgePointId?: number }) {
  return http.get<PageResult<StudentKnowledgeStats>>('/learn/stats/knowledge/page', params)
}

export function getWeaknessList(studentId: number) {
  return http.get<StudentKnowledgeStats[]>(`/learn/stats/knowledge/weakness?studentId=${studentId}`)
}

export function getStudentQuestionRecordPage(params: PageParam & { studentId?: number; questionId?: number; isCorrect?: number; knowledgePointId?: number; taskId?: number }) {
  return http.get<PageResult<StudentQuestionRecord>>('/learn/stats/question-record/page', params)
}
