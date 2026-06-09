import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { LearningTask } from './index'

export function getTodayTasks(studentId: number) {
  return http.get<LearningTask[]>(`/app/learn/tasks/today?studentId=${studentId}`)
}

export function completeTask(taskId: number) {
  return http.post<boolean>(`/app/learn/tasks/complete?taskId=${taskId}`)
}

export function getLearningTaskPage(params: PageParam & { studentId?: number; status?: number; taskDate?: string }) {
  return http.get<PageResult<LearningTask>>('/learn/task/page', params)
}
