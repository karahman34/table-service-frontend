const vuex = {
  namespaced: true,

  state: {
    value: false,
    message: null,
  },

  mutations: {
    SET_VALUE(state, value) {
      state.value = value
    },
    SET_MESSAGE(state, message) {
      state.message = message
    },
  },
}

class Overlay {
  constructor(store) {
    this.store = store
  }

  get value() {
    return this.store.state.overlay.value
  }

  get message() {
    return this.store.state.overlay.message
  }

  show(message = null) {
    this.store.commit('overlay/SET_VALUE', true)

    if (message !== null) {
      this.store.commit('overlay/SET_MESSAGE', message)

    }
  }

  close() {
    this.store.commit('overlay/SET_VALUE', false)
  }
}

const plugin = {
  install: (Vue, {
    store,
  }) => {
    store.registerModule('overlay', vuex)
    Vue.prototype.$overlay = new Overlay(store)
  },
}

export default plugin