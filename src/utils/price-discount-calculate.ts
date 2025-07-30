export default function calPriceDiscount(price: number = 0, discount: number = 0): number {
  return Math.floor(price - (price * discount) / 100)
}
