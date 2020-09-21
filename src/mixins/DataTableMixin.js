export default {
  data() {
    return {
      dataTableAction: null,
      items: [],
      tableLoading: false,
      searchQuery: null,
      page: 1,
      lastPage: null,
      sortBy: [],
      sortDesc: [],
      serverItemsLength: null,
      itemsPerPage: 10,
      disableSortAndSearchChange: false,
    }
  },

  computed: {
    sort() {
      const sort = this.sortBy.map((field, index) => {
        let direction = ''
        if (this.sortDesc[index] === true) {
          direction = '-'
        }

        return `${direction}${field}`
      })

      return sort.length ? sort.join(',') : null
    },
    query() {
      return {
        page: this.page,
        sort: this.sort,
        limit: this.itemsPerPage,
        search: this.searchQuery,
      }
    },
  },

  watch: {
    page() {
      this.getItems()
    },
    sort() {
      if (this.disableSortAndSearchChange) return

      this.page === 1
        ? this.getItems()
        : this.page = 1
    },
    itemsPerPage() {
      this.page === 1
        ? this.getItems()
        : this.page = 1
    },
    searchQuery() {
      if (this.disableSortAndSearchChange) return

      this.page === 1
        ? this.getItems()
        : this.page = 1
    },
    dataTableAction(val, old) {
      if (!old && val) this.getItems()
    },
  },

  methods: {
    showNewItem() {
      this.disableSortAndSearchChange = true
      
      const primaryField = this.headers.find(header => header.primary === true)
      this.sortBy = [primaryField.value]
      this.sortDesc = [true]
      this.searchQuery = null

      this.page === 1 ? this.getItems() : this.page = 1
    },
    refreshItems() {
      this.getItems()
    },
    async getItems() {
      this.tableLoading = true

      try {
        const res = await this.dataTableAction(this.query)
        const {ok, data, meta} = res.data

        if (ok) {
          this.items = data
          this.lastPage = meta.last_page
          this.serverItemsLength = meta.total
        }
      } catch (err) {
        this.$alert.show({
          message: 'Failed to get items from api.',
          color: 'error',
        })
      } finally {
        this.tableLoading = false
        this.disableSortAndSearchChange = false
      }
    },
  },
}