import { http } from '@/plugins/http'

const prefix = '/transactions'

export default {
  collection(params = null) {
    return http.get(prefix, {
      params,
    })
  },
  create(payload) {
    return http.post(prefix, payload)
  },
  show(id) {
    return http.get(`${prefix}/${id}`)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
}