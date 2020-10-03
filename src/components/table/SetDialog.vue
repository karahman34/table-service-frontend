<template>
  <v-dialog
    v-model="dialog"
      
     
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        Set Table

        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="save">
          <v-text-field
            v-model="form.number"
            label="Number"
            prepend-inner-icon="mdi mdi-format-list-numbered"
          />

          <div class="d-flex justify-end">
            <v-btn
              type="submit"
              color="green lighten-1 white--text"
              :loading="loading"
            >
              Save
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DialogMixin from '@/mixins/DialogMixin'

export default {
  mixins: [DialogMixin],

  data() {
    return {
      form: {
        number: null,
      },
      loading: false,
    }
  },

  computed: {
    ...mapState('table', {
      currentNumber: state => state.number,
    }),
  },

  mounted () {
    if (this.currentNumber) this.form.number = this.currentNumber
  },

  methods: {
    ...mapActions('table', {
      setTable: 'setTable',
    }),
    async save() {
      this.loading = true

      try {
        await this.setTable(this.form.number)

        this.$alert.show({
          message: 'Table ready!',
        })
      } catch (err) {
        const errMessage= err?.response?.data?.message
        this.$alert.show({
          type: 'error',
          message: errMessage || 'Failed to set table.',
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>