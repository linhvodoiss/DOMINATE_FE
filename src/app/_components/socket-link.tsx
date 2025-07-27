// lib/socket-client.ts
import SockJS from 'sockjs-client'
import { CompatClient, Stomp } from '@stomp/stompjs'
import { env } from '~/configs/env'

let stompClient: CompatClient | null = null

export function getStompClient(): CompatClient {
  if (stompClient) return stompClient

  const socket = new SockJS(`${env.SOCKET_URL}/ws`)
  stompClient = Stomp.over(socket)
  return stompClient
}
