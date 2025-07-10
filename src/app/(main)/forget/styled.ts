'use client'

import styled, { css } from 'styled-components'
import { scaleMediaStyles } from '~/utils/styles'

export const ForgetStyled = styled.div<{ $mobileWidth?: number }>`
  ${({ $mobileWidth }) =>
    scaleMediaStyles($mobileWidth, {
      base: css``,
      landscape: css``,
      portrait: css`
        .form {
          width: 100%;
        }
      `,
    })}
`
