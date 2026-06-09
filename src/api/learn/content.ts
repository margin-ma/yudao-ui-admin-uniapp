import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { ContentRecord } from './index'

export function generateContent(data: { studentId?: number; staffId?: number; contentType: string; title?: string; sourceMaterial: string }) {
  return http.post<ContentRecord>('/app/learn/content/generate', data)
}

export function getContentRecord(id: number) {
  return http.get<ContentRecord>(`/app/learn/content/get/${id}`)
}

export function getContentRecordPage(params: PageParam & { contentType?: string; status?: number }) {
  return http.get<PageResult<ContentRecord>>('/app/learn/content/page', params)
}

export function deleteContentRecord(id: number) {
  return http.delete<boolean>(`/app/learn/content/delete/${id}`)
}
