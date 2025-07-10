import { AUTH } from '~/constants'

export const removeCookieHeaderString = [
  `${AUTH.token}=; Path=/; HttpOnly; Max-Age=0`,
  `${AUTH.userInfo}=; Path=/; HttpOnly; Max-Age=0`,
].join(', ')
