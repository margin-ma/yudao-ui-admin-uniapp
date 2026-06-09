import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { DiagnosisReport } from './index'

export function getDiagnosisReportPage(params: PageParam & { studentId?: number; reportType?: string; status?: number }) {
  return http.get<PageResult<DiagnosisReport>>('/learn/diagnosis-report/page', params)
}

export function getDiagnosisReport(id: number) {
  return http.get<DiagnosisReport>(`/learn/diagnosis-report/get/${id}`)
}

export function createDiagnosisReport(data: Partial<DiagnosisReport>) {
  return http.post<number>('/learn/diagnosis-report/create', data)
}

export function updateDiagnosisReport(data: Partial<DiagnosisReport>) {
  return http.put<boolean>('/learn/diagnosis-report/update', data)
}

export function publishDiagnosisReport(id: number) {
  return http.post<boolean>(`/learn/diagnosis-report/publish/${id}`)
}

export function deleteDiagnosisReport(id: number) {
  return http.delete<boolean>(`/learn/diagnosis-report/delete/${id}`)
}

export function getDiagnosisReportDraftList(params: PageParam) {
  return http.get<PageResult<DiagnosisReport>>('/learn/diagnosis-report/draft-list', params)
}
