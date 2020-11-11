import authApi from '@/api/authApi'
import { setToken } from './http'

const vuex = {
  namespaced: true,

  state: {
    loggedIn: false,
    token: null,
    user: null,
  },

  mutations: {
    SET_LOGGED_IN(state, val) {
      state.loggedIn = val
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_USER(state, user) {
      state.user = user
    },
  },

  actions: {
    async login({commit}, credentials) {
      try {
        const res = await authApi.login(credentials)
        const {ok, data} = res.data
  
        if (ok) {
          const {access_token, expired_in, type, user} = data 
  
          const token = `${type} ${access_token}`
  
          setToken(token, expired_in)
  
          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          commit('SET_LOGGED_IN', true)
  
          return Promise.resolve(true)
        }
        
        return Promise.reject(res)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async getUser({commit}) {
      try {
        const res = await authApi.me()
        const {ok, data} = res.data
  
        if (ok) {
          commit('SET_USER', data.user)
          commit('SET_LOGGED_IN', true)
  
          return Promise.resolve(res)
        }
  
        return Promise.reject(res)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async logout({commit}, payload = null) {
      try {
        const res = await authApi.logout(payload)
        const {ok} = res.data
  
        if (ok) {
          commit('SET_USER', null)
          commit('SET_TOKEN', null)
          commit('SET_LOGGED_IN', false)
  
          return Promise.resolve(res)
        }
  
        return Promise.reject(res)
      } catch (err) {
        return Promise.reject(err)
      }
    },
  },
}

class Auth {
  constructor(store) {
    this.store = store
  }

  get user() {
    return this.store.state.auth.user
  }

  get token() {
    return this.store.state.auth.token
  }

  get loggedIn() {
    return this.store.state.auth.loggedIn
  }

  setUser(user) {
    this.store.commit('auth/SET_USER', user)
  }

  setToken(token) {
    this.store.commit('auth/SET_TOKEN', token)
  }

  setLoggedIn(val) {
    this.store.commit('auth/SET_LOGGED_IN', val)
  }

  can(permissions) {
    const userPermissions = this.store.state.auth.user?.permissions
    if (!userPermissions) return false
    
    if (!Array.isArray(permissions)) {
      return userPermissions.includes(permissions)
    } else {
      for (const permission of permissions) {
        if (!userPermissions.includes(permission)) {
          return false
        }
      }

      return true
    }
  }

  async login(credentials) {
    return this.store.dispatch('auth/login', credentials)
  }

  async getUser() {
    return this.store.dispatch('auth/getUser')
  }

  async logout(payload = null) {
    return this.store.dispatch('auth/logout', payload)
  }
}

const plugin = {
  install: (Vue, {store}) => {
    store.registerModule('auth', vuex)

    Vue.prototype.$auth = new Auth(store)
  },
}

export default plugin