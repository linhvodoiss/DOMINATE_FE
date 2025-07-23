export const isInvalidId = (id: string | undefined) => !id || id === 'unknown' || !/^\d+$/.test(id)
