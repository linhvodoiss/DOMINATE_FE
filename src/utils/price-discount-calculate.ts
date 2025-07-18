export default function calPriceDiscount(price: number, discount: number) {
  return price - (price * discount) / 100
}
