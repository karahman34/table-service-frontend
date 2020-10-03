import {formatMoney} from 'accounting-js'

export function rupiah(price) {
  return formatMoney(price, {
    symbol: 'Rp. ',
    precision: 0,
    thousand: '.', 
    decimal: ',',
  })
}