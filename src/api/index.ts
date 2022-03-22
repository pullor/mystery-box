import { GET, POST } from '../request'

export function login(params: { code: string; state?: string }) {
  return GET('/api/v1/login', params)
}
