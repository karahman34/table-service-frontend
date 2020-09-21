const vuex = {
  namespaced: true,

  state: {
    value: false,
    color: null,
    message: null,
    timeout: 6000,
  },

  mutations: {
    SET_VALUE(state, value) {
      state.value = value
    },
    SET_MESSAGE(state, message) {
      state.message = message
    },
    SET_TIMEOUT(state, timeout) {
      state.timeout = timeout
    },
    SET_COLOR(state, color) {
      state.color = color
    },
    CLEAR(state) {
      state.value = false
      state.color = null
      state.message = null
      state.timeout = 6000
    },
  },
}

class Alert {
  constructor(store, moduleName) {
    this.store = store
    this.moduleName = moduleName
  }

  get value() {
    return this.store.state[this.moduleName].value
  }

  get message() {
    return this.store.state[this.moduleName].message
  }

  get timeout() {
    return this.store.state[this.moduleName].timeout
  }

  get color() {
    return this.store.state[this.moduleName].color
  }

  show({message, timeout, color}) {
    this.store.commit(`${this.moduleName}/SET_VALUE`, true)

    if (message) {
      this.store.commit(`${this.moduleName}/SET_MESSAGE`, message)
    }

    if (timeout) {
      this.store.commit(`${this.moduleName}/SET_TIMEOUT`, timeout)
    }

    if (color) {
      this.store.commit(`${this.moduleName}/SET_COLOR`, color)
    }
  }

  close() {
    this.store.commit(`${this.moduleName}/CLEAR`)
  }
}

const plugin = {
  install: (Vue, {
    store,
  }) => {
    const moduleName = 'alert'

    store.registerModule(moduleName, vuex)
    Vue.prototype.$alert = new Alert(store, moduleName)
  },
}

export default plugin