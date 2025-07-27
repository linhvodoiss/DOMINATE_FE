import SockJS from 'sockjs-client'
import { CompatClient, Stomp } from '@stomp/stompjs'
import { env } from '~/configs/env'

let stompClient: CompatClient | null = null
let isConnected = false
let isConnecting = false

const subscribeQueue: ((client: CompatClient) => void)[] = []
const subscribeRegistry = new Set<string>() // Track topic subscribe

export function getStompClient(): CompatClient {
  if (stompClient) return stompClient

  const socket = new SockJS(`${env.SOCKET_URL}/ws`)
  stompClient = Stomp.over(socket)
  stompClient.debug = () => {}

  return stompClient
}

export function initSocket() {
  const client = getStompClient()

  if (isConnected || isConnecting) return

  isConnecting = true
  client.connect({}, () => {
    isConnected = true
    isConnecting = false
    console.log('[STOMP] Connected')

    while (subscribeQueue.length) {
      const fn = subscribeQueue.shift()
      fn?.(client)
    }
  })
}

export function subscribeOnce(topic: string, callback: (client: CompatClient) => void) {
  if (subscribeRegistry.has(topic)) {
    return
  }

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
      stompClient = null
      isConnected = false
      isConnecting = false
    })
  }
}
