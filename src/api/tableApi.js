import { http } from '@/plugins/http'

const prefix = '/tables'

export default {
  collection(params = null) {
    return http.get(prefix, {
      params,
    })
  },
  create(payload) {
    return http.post(prefix, payload)
  },
  getOrder(id) {
    return http.get(`${prefix}/${id}/order` )
  },
  update(id, payload) {
    return http.post(`${prefix}/${id}`, payload)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
}