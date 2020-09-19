import { removeToken, setToken } from './http'

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
}

class Auth {
  constructor(store, http, loginUrl, logoutUrl, userUrl) {
    this.store = store
    this.http = http
    this.loginUrl = loginUrl
    this.logoutUrl = logoutUrl
    this.userUrl = userUrl
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

  async login(credentials) {
    try {
      const res = await this.http.post(this.loginUrl, credentials)
      const {ok, data} = res.data

      if (ok) {
        const {access_token, expired_in, type, user} = data 

        const token = `${type} ${access_token}`

        setToken(token, expired_in)

        this.setUser(user)
        this.setToken(token)
        this.setLoggedIn(true)

        return Promise.resolve(true)
      }
      
      return Promise.reject(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async getUser() {
    try {
      const res = await this.http.get(this.userUrl)
      const {ok, data} = res.data

      if (ok) {
        this.setUser(data.user)
        this.setLoggedIn(true)

        return Promise.resolve(true)
      }

      return Promise.reject(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  async logout() {
    try {
      const res = await this.http.post(this.logoutUrl)
      const {ok} = res.data
      
      if (ok) {
        removeToken()

        this.setUser(null)
        this.setToken(null)
        this.setLoggedIn(false)

        return Promise.resolve(true)
      }

      return Promise.reject(res)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}

const plugin = {
  install: (Vue, {store, http, loginUrl, logoutUrl, userUrl}) => {
    store.registerModule('auth', vuex)

    Vue.prototype.$auth = new Auth(store, http, loginUrl, logoutUrl, userUrl)
  },
}

export default plugin