export function dateISO() {
  return new Date().toISOString()
}
export type TimeUnit =
  | 'ms' // milliseconds
  | 's' // seconds
  | 'm' // minutes
  | 'h' // hours
  | 'd' // days
  | 'w' // weeks
  | 'mo' // months, approx 30 days
  | 'y' // years, approx 365 days


export type TimeUnitKey = `${number}${TimeUnit}`


export const UNIT_TO_MS: Record<TimeUnit, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  mo: 30 * 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000,
}

export function parseDurationToMs(duration: TimeUnitKey): number {
  const match = duration.match(/^(\d+(?:\.\d+)?)(ms|mo|s|m|h|d|w|y)$/)

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`)
  }

  const value = Number(match[1])
  const unit = match[2] as TimeUnit

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid duration value: ${duration}`)
  }

  return value * UNIT_TO_MS[unit]
}


export function getExpiresAt(ttl: TimeUnitKey, now?: Date) {
  const nowDate = now ? now : new Date()

  return new Date(
    nowDate.getTime() + parseDurationToMs(ttl),
  ).toISOString()
}
