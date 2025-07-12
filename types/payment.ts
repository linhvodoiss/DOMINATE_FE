export type PaymentResponse = {
  bin: string
  accountNumber: string
  accountName: string
  currency: string
  paymentLinkId: string
  amount: number
  description: string
  orderCode: number
  status: string
  checkoutUrl: string
  qrCode: string
}
