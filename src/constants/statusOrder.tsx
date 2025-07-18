import { OrderStatusEnum } from '#/tabs-order'

export const getPaymentStatusText = (status?: string) => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return <span className='text-[#ffc107]'>Pending</span>
    case OrderStatusEnum.PROCESSING:
      return <span className='text-blue-600'>Processing</span>
    case OrderStatusEnum.SUCCESS:
      return <span className='text-[#198754]'>Success</span>
    case OrderStatusEnum.FAILED:
      return <span className='text-[#dc3545]'>Cancel</span>
    default:
      return <span>Undefined</span>
  }
}
