import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { HomeworkUpload } from './index'

export function correctHomework(data: { studentId: number; imageBase64: string }) {
  return http.post<any>('/app/learn/homework/correct', data)
}

export function uploadHomework(studentId: number, file: any) {
  return http.post<HomeworkUpload>('/app/learn/homework/upload', { studentId, file })
}

export function getHomeworkRecordPage(params: PageParam & { studentId?: number }) {
  return http.get<PageResult<HomeworkUpload>>('/app/learn/homework/records', params)
}
