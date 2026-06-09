import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { ParentConsultRecord } from './index'

export function askConsult(data: { studentId: number; parentName?: string; parentPhone?: string; question: string; subject?: string; grade?: string }) {
  return http.post<ParentConsultRecord>('/app/learn/consult/ask', data)
}

export function getConsultRecord(id: number) {
  return http.get<ParentConsultRecord>(`/app/learn/consult/get/${id}`)
}

export function getConsultHistory(params: PageParam & { studentId?: number }) {
  return http.get<PageResult<ParentConsultRecord>>('/app/learn/consult/history', params)
}

export function deleteConsultRecord(id: number) {
  return http.delete<boolean>(`/app/learn/consult/delete/${id}`)
}
