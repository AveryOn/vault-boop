import { parseDurationToMs, type TimeUnit } from "~/shared/utils/datetime"

export type SleepDuration = `${number}${TimeUnit}`
const MAX_TIMEOUT_MS = 2_147_483_647


export async function sleep(
  duration: SleepDuration | number,
): Promise<void> {
  let remainingMs =
    typeof duration === 'number' ? duration : parseDurationToMs(duration)

  while (remainingMs > 0) {
    const currentMs = Math.min(remainingMs, MAX_TIMEOUT_MS)

    await new Promise<void>((resolve) => {
      setTimeout(resolve, currentMs)
    })

    remainingMs -= currentMs
  }
}
