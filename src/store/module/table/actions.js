import tableApi from '@/api/tableApi'

export default {
  async setTable({commit}, payload) {
    try {
      const res = await tableApi.setTable(payload)
      const {ok} = res.data

      if (!ok) return Promise.reject(res)

      commit('SET_NUMBER', payload.number)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}