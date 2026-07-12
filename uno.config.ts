import type { Rule } from 'unocss'

import { defineConfig, presetWind3 } from 'unocss'

const clampRule: Rule = [
  /**
   * Кейсы:
   * clamp-[margin-top,48,126,360,1440]
   * clamp-[margin-top,48,126,360,1440]
   * clamp-[margin-top,-48,126,360,1440]
   * clamp-w-[margin-top,48,126,360,1440]
   * clamp-h-[margin-top,48,126,360,1440]
   */
  /^clamp(?:-(w|h))?-\[([A-z-]+),(-?\d+),(-?\d+),(-?\d+),(-?\d+)\]$/,
  (matched) => {
    const [, orientation, prop, ...values] = matched
    const unit = 'px'
    const [min, max, minW, maxW] = values.map((v) =>
      Number.parseFloat(v.trim()),
    )

    if ([min, max, maxW, minW].some(Number.isNaN) || maxW === minW) {
      return
    }

    const slope = (max - min) / (maxW - minW)
    // const y = min - (slope * minW) / 100
    const y = (-minW * slope + min).toFixed(4)
    const slopePercent = (slope * 100).toFixed(4)
    const preferred = `${Number.parseFloat(y)}${unit} + ${Number.parseFloat(slopePercent)}v${orientation || 'w'}`

    return {
      [prop]: `clamp(${min}${unit}, ${preferred}, ${max}${unit})`,
    }
  },
]

export default defineConfig({
  shortcuts: [
    ['btn', 'rounded bg-blue-700 px-4 py-1 text-white'],
    ['d-link', 'color-blue-400 cursor-pointer hover:color-blue-200'],
  ],
  rules: [
    ['scrolling-touch', { '-webkit-overflow-scrolling': 'touch' }],
    clampRule,
  ],
  presets: [presetWind3()],
})
