import { http } from '@/http/http'

export function generateScript(scene: string, description: string) {
  return http.post<string>('/app/learn/script/generate', null, { scene, description })
}
