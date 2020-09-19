import { http } from '@/plugins/http'

const prefix = 'auth'

export default {
  me() {
    return http.get(`${prefix}/me`)
  },
  login(credentials) {
    return http.post(`${prefix}/login`, credentials)
  },
  logout() {
    return http.post(`${prefix}/logout`)
  },
}