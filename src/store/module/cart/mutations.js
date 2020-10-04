export default {
  SET_ITEMS(state, {food, qty, tips}) {
    const itemExist = state.items.find(item => item.food.id === food.id)
    if (!itemExist) {
      state.items.push({
        food,
        qty,
        tips: tips ? tips : null,
      })
    }
  },
  UPDATE_ITEM(state,  {food, qty, tips}) {
    const cart = state.items.find(item => item.food.id === food.id)
    cart.qty = qty
    cart.tips = tips
  },
  REMOVE_ITEM(state, food) {
    const itemIndex = state.items.findIndex(item => item.food.id === food.id.toString)
    state.items.splice(itemIndex, 1)
  },
  CLEAR(state) {
    state.items = []
  },
}