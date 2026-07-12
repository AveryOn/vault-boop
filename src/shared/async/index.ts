type TimeUnit =
  | 'ms' // milliseconds
  | 's' // seconds
  | 'm' // minutes
  | 'h' // hours
  | 'd' // days
  | 'w' // weeks
  | 'mo' // months, approx 30 days
  | 'y' // years, approx 365 days

export type SleepDuration = `${number}${TimeUnit}`

const UNIT_TO_MS: Record<TimeUnit, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  mo: 30 * 24 * 60 * 60 * 1000,
  y: 365 * 24 * 60 * 60 * 1000,
}

const MAX_TIMEOUT_MS = 2_147_483_647

export function parseDurationToMs(duration: SleepDuration): number {
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

export async function sleep(duration: SleepDuration | number): Promise<void> {

  let remainingMs = typeof duration === 'number' ? duration : parseDurationToMs(duration)

  while (remainingMs > 0) {
    const currentMs = Math.min(remainingMs, MAX_TIMEOUT_MS)

    await new Promise<void>((resolve) => {
      setTimeout(resolve, currentMs)
    })

    remainingMs -= currentMs
  }
}
