import Vue from 'vue'
import Vuetify, { colors } from 'vuetify/lib'

Vue.use(Vuetify)

const buttons = {
  create: colors.green.lighten1,
}

export default new Vuetify({
  theme: {
    themes: {
      light: {
        createButton: buttons.create,
      },
      dark:{
        createButton: buttons.create,
      },
    },
  },
})
