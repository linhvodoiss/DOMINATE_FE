import { A_SECOND } from '~/constants'

export const env = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  BASE_API_URL: process.env.NEXT_PUBLIC_BASE_API_URL || '',
  DEBUG_LOG: +(process.env.NEXT_PUBLIC_DEBUG_LOG || '0'),
  TOKEN_EXPIRED: Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRED)
    ? Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRED)
    : A_SECOND * 24 * 60 * 60 * 2,
}
