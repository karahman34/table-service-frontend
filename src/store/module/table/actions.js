import tableApi from '@/api/tableApi'

export default {
  async setTable({commit}, number) {
    try {
      const res = await tableApi.setTable({
        number,
      })
      const {ok} = res.data

      if (!ok) return Promise.reject(res)

      commit('SET_NUMBER', number)

      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}