import { http } from '@/plugins/http'

const prefix = '/orders'

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
  serveFood(id, detailId) {
    return http.post(`${prefix}/${id}/details/${detailId}`)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
  deleteDetail(id, detailId) {
    return http.delete(`${prefix}/${id}/details/${detailId}`)
  },
}