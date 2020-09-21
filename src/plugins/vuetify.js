import Vue from 'vue'
import Vuetify, { colors } from 'vuetify/lib'

Vue.use(Vuetify)

const buttons = {
  create: colors.green.lighten1,
  edit: colors.amber,
  delete: colors.red.accent2,
}

export default new Vuetify({
  theme: {
    themes: {
      light: {
        createButton: buttons.create,
        editButton: buttons.edit,
        deleteButton: buttons.delete,
      },
      dark:{
        createButton: buttons.create,
        editButton: buttons.edit,
        deleteButton: buttons.delete,
      },
    },
  },
})
