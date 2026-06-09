import type { PageParam, PageResult } from '@/http/types'
import { http } from '@/http/http'
import type { MemberOrder } from './index'

export function getMemberOrderPage(params: PageParam & { studentId?: number; status?: number }) {
  return http.get<PageResult<MemberOrder>>('/learn/order/page', params)
}
