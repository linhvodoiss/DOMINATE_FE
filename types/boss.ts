export type Boss = {
  id: number
  name: string
  maxHP: number
  currentHP: number
  imageUrl: string
  status: boolean
  appearedAt: string
}

export type Streak = {
  streak: number
}

export type LogAttackBoss = {
  userId?: number
  userName?: string
  characterId?: number
  characterName?: string
  gameId?: number
  serverId?: number
  serverName?: string
  bossId?: number
  hPBefore?: number
  hPAfter?: number
  hPAttack?: number
  createdAt?: Date
  updatedAt?: Date
}

export type GiftReceived = {
  streakGifts: { id: number; giftId: number }[]
  bossGifts: { userId: number; bossId: number }[]
}
