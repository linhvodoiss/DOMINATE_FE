import { sha256 } from 'js-sha256'

export function getHardwareId(): string {
  if (typeof window === 'undefined') return ''

  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const language = navigator.language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const screenSize = `${window.screen.width}x${window.screen.height}`

  const raw = `${userAgent}|${platform}|${language}|${timezone}|${screenSize}`
  return sha256(raw)
}
