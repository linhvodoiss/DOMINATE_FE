import { css } from 'styled-components'

import { WIDTH_MOBILE_DEFAULT } from '~/constants'

export const scaleMediaStyles = (
  $mobileWidth: number = WIDTH_MOBILE_DEFAULT,
  mediaCss?: {
    base?: ReturnType<typeof css>
    xs_portrait?: ReturnType<typeof css>
    landscape?: ReturnType<typeof css>
    portrait?: ReturnType<typeof css>
  }
) => css`
  ${mediaCss?.base}
  @media (min-width: ${$mobileWidth}px) {
    ${mediaCss?.landscape}
  }

  @media (max-width: ${$mobileWidth - 1}px) {
    ${mediaCss?.portrait}
  }
`
