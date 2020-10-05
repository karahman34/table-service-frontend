import { http } from '@/plugins/http'

const prefix = '/permissions'

export default {
  collection(params = null) {
    return http.get(prefix, {
      params,
    })
  },
  export(params) {
    return http.get(`${prefix}/export`, {
      params,
      responseType: 'blob',
    })
  }, 
  import(payload) {
    return http.post(`${prefix}/import`, payload)
  }, 
  create(payload) {
    return http.post(prefix, payload)
  },
  show(id) {
    return http.get(`${prefix}/${id}`)
  },
  update(id, payload) {
    return http.post(`${prefix}/${id}`, payload)
  },
  syncRoles(id, payload) {
    return http.post(`${prefix}/${id}/roles`, payload)
  },
  delete(id) {
    return http.delete(`${prefix}/${id}`)
  },
}