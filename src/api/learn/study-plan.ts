import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { StudyPlan } from './index'

export function getStudyPlanPage(params: PageParam & { studentId?: number; isActive?: number }) {
  return http.get<PageResult<StudyPlan>>('/learn/study-plan/page', params)
}

export function getActiveStudyPlan(studentId: number) {
  return http.get<StudyPlan>(`/learn/study-plan/active?studentId=${studentId}`)
}
