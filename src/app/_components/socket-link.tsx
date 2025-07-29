/* eslint-disable @typescript-eslint/no-explicit-any */
import SockJS from 'sockjs-client'
import { CompatClient, Stomp } from '@stomp/stompjs'
import { env } from '~/configs/env'

let stompClient: CompatClient | null = null
let isConnected = false
let isConnecting = false

const subscribeQueue: ((client: CompatClient) => void)[] = []
const subscribeRegistry = new Set<string>()

const RECONNECT_DELAY = 5000
let reconnectTimer: NodeJS.Timeout | null = null

export function getStompClient(): CompatClient {
  if (stompClient) return stompClient

  const socket = new SockJS(`${env.SOCKET_URL}/ws`)
  stompClient = Stomp.over(socket)

  stompClient.debug = () => {}

  // When socket disconnect is (lost internet, server down,...)
  stompClient.onWebSocketClose = event => {
    console.warn('[STOMP] Socket closed:', event)
    isConnected = false
    isConnecting = false
    attemptReconnect()
  }

  stompClient.onStompError = frame => {
    console.error('[STOMP] Frame error:', frame)
    isConnected = false
    isConnecting = false
    attemptReconnect()
  }

  return stompClient
}

export function initSocket() {
  const client = getStompClient()

  if (isConnected || isConnecting) return

  isConnecting = true
  client.connect(
    {},
    () => {
      isConnected = true
      isConnecting = false
      console.log('[STOMP] Connected')

      // Clear reconnect timer nếu đã thành công
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }

      while (subscribeQueue.length) {
        const fn = subscribeQueue.shift()
        fn?.(client)
      }
    },
    (error: any) => {
      console.error('[STOMP] Connect failed:', error)
      isConnected = false
      isConnecting = false
      attemptReconnect()
    }
  )
}

function attemptReconnect() {
  if (reconnectTimer) return

  console.log(`[STOMP] Attempting reconnect in ${RECONNECT_DELAY / 1000}s...`)
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    initSocket()
  }, RECONNECT_DELAY)
}

export function subscribeOnce(topic: string, callback: (client: CompatClient) => void) {
  if (subscribeRegistry.has(topic)) return

  subscribeRegistry.add(topic)

  const client = getStompClient()
  if (isConnected) {
    callback(client)
  } else {
    subscribeQueue.push(callback)
  }
}

export function subscribeOnceNoRegister(callback: (client: CompatClient) => void) {
  const client = getStompClient()
  if (isConnected) {
    callback(client)
  } else {
    subscribeQueue.push(callback)
  }
}

export function disconnectSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('[STOMP] Disconnected')
    })
  }

  // Reset status socket
  stompClient = null
  isConnected = false
  isConnecting = false
  subscribeRegistry.clear()
  subscribeQueue.length = 0
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
}
