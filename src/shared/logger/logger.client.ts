import chalk from 'chalk'

export type LoggerDetails = Record<string, unknown>
export type LogLevel = 'info' | 'error' | 'debug' | 'fatal' | 'warn'

const SEPARATOR = chalk.hex('#ba86b7')('::')

export class Logger {
  private context: string | null
  private colors = {
    info: '#87d1f3',
    debug: '#a2f4bf',
    warn: '#efc945',
    error: '#ea4162',
    fatal: '#e5002b',
  }
  private bgColor = '#232323'

  constructor(context?: string) {
    this.context = context ?? null
  }

  info(msg?: string, details?: LoggerDetails) {
    const fg = this.colors.info
    const bg = this.bgColor
    const now = new Date().toISOString()
    console.log(
      /* LOG_LEVEL */ chalk.bold.hex(fg).bgHex(bg)('[INFO]'),
      SEPARATOR,
      /* DATETIME */ chalk.bold.hex(fg).bgHex(bg)(`[${now}]`),
      SEPARATOR,
      /* CONTEXT */ chalk.bold.black.bgHex(fg)(`{${this.context}}`),
      SEPARATOR,
      /* MSG + DETAILS */ chalk.hex(fg)(msg),
      details,
    )
  }

  debug(msg?: string, details?: LoggerDetails) {
    const fg = this.colors.debug
    const bg = this.bgColor
    const now = new Date().toISOString()
    console.log(
      /* LOG_LEVEL */ chalk.bold.hex(fg).bgHex(bg)('[DEBUG]'),
      SEPARATOR,
      /* DATETIME */ chalk.bold.hex(fg).bgHex(bg)(`[${now}]`),
      SEPARATOR,
      /* CONTEXT */ chalk.bold.black.bgHex(fg)(`{${this.context}}`),
      SEPARATOR,
      /* MSG + DETAILS */ chalk.hex(fg)(msg),
      details,
    )
  }

  warn(msg?: string, details?: LoggerDetails) {
    const fg = this.colors.warn
    const bg = this.bgColor
    const now = new Date().toISOString()
    console.log(
      /* LOG_LEVEL */ chalk.bold.hex(fg).bgHex(bg)('[WARN]'),
      SEPARATOR,
      /* DATETIME */ chalk.bold.hex(fg).bgHex(bg)(`[${now}]`),
      SEPARATOR,
      /* CONTEXT */ chalk.bold.black.bgHex(fg)(`{${this.context}}`),
      SEPARATOR,
      /* MSG + DETAILS */ chalk.hex(fg)(msg),
      details,
    )
  }

  error(msg?: string, details?: LoggerDetails) {
    const fg = this.colors.error
    const bg = this.bgColor
    const now = new Date().toISOString()
    console.log(
      /* LOG_LEVEL */ chalk.bold.hex(fg).bgHex(bg)('[ERROR]'),
      SEPARATOR,
      /* DATETIME */ chalk.bold.hex(fg).bgHex(bg)(`[${now}]`),
      SEPARATOR,
      /* CONTEXT */ chalk.bold.black.bgHex(fg)(`{${this.context}}`),
      SEPARATOR,
      /* MSG + DETAILS */ chalk.hex(fg)(msg),
      details,
    )
  }

  fatal(msg?: string, details?: LoggerDetails) {
    const fg = this.colors.fatal
    const now = new Date().toISOString()
    console.log(
      /* LOG_LEVEL */ chalk.bold.black.bgHex(fg)('[FATAL]'),
      SEPARATOR,
      /* DATETIME */ chalk.bold.black.bgHex(fg)(`[${now}]`),
      SEPARATOR,
      /* CONTEXT */ chalk.bold.black.bgHex(fg)(`{${this.context}}`),
      SEPARATOR,
      /* MSG + DETAILS */ chalk.bold.black.bgHex(fg)(msg),
      details,
    )
  }
}
