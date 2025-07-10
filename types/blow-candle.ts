export type LogBlowCandle = {
  userId?: number
  userName?: string
  characterId?: number
  characterName?: string
  gameId?: number
  serverId?: number
  serverName?: string
  quantity?: number
  createdAt?: Date
  updatedAt?: Date
}

export type BlowCandleInfo = {
  availableTurn?: number
  usedTurn?: number
}

export type RankingBlowCandle = {
  serverId?: number
  serverName?: string
  characterName?: string
  characterId?: number
  usedTurn?: number
}
