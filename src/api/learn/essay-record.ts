import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { EssayRecord } from './index'

export function getEssayRecordPage(params: PageParam & { studentId?: number; status?: number }) {
  return http.get<PageResult<EssayRecord>>('/learn/essay-record/page', params)
}

export function getEssayRecord(id: number) {
  return http.get<EssayRecord>(`/learn/essay-record/get/${id}`)
}

export function deleteEssayRecord(id: number) {
  return http.delete<boolean>(`/learn/essay-record/delete/${id}`)
}

export function batchDeleteEssayRecord(ids: number[]) {
  return http.delete<boolean>('/learn/essay-record/batch-delete', { ids })
}
