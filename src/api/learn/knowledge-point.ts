import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { KnowledgePoint } from './index'

export function getKnowledgePointPage(params: PageParam & { name?: string; subject?: string; status?: number }) {
  return http.get<PageResult<KnowledgePoint>>('/learn/knowledge-point/page', params)
}

export function getKnowledgePoint(id: number) {
  return http.get<KnowledgePoint>(`/learn/knowledge-point/get?id=${id}`)
}

export function createKnowledgePoint(data: Partial<KnowledgePoint>) {
  return http.post<number>('/learn/knowledge-point/create', data)
}

export function updateKnowledgePoint(data: Partial<KnowledgePoint>) {
  return http.put<boolean>('/learn/knowledge-point/update', data)
}

export function deleteKnowledgePoint(id: number) {
  return http.delete<boolean>(`/learn/knowledge-point/delete?id=${id}`)
}

export function getKnowledgePointListBySubject(subject: string) {
  return http.get<KnowledgePoint[]>(`/learn/knowledge-point/list-by-subject?subject=${subject}`)
}
