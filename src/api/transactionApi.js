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
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
}