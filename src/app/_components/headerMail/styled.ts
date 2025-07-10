'use client'

import styled, { css } from 'styled-components'
import { scaleMediaStyles } from '~/utils/styles'

export const WebHeaderStyled = styled.div<{ $mobileWidth?: number }>`
  ${({ $mobileWidth }) =>
    scaleMediaStyles($mobileWidth, {
      base: css`
        .header__link {
          position: relative;
          padding: 1.5rem 2rem;
          color: white;
          text-decoration: none;
          cursor: pointer;
        }

        .header__link::after {
          content: '';
          position: absolute;
          bottom: 0.75rem;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background-color: white;
          transition: width 0.3s ease;
        }

        .header__link:hover::after {
          width: 66.666%;
        }
      `,
      landscape: css`
        .header__container {
        }
      `,
      portrait: css`
        .header__container {
        }
      `,
    })}
`
