import {formatMoney} from 'accounting-js'

export function rupiah(price) {
  return formatMoney(price, {
    symbol: 'Rp. ',
    precision: 0,
    thousand: '.', 
    decimal: ',',
  })
}

export function calculateFoodPrice(food) {
  let price = food.price
  const discount = food.discount

  if (parseInt(discount) > 0) {
    const discountPrice = discount / 100 * price
    price -= discountPrice
  }

  return price
}