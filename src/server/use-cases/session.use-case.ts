import type { Logger } from "~/shared/logger/logger.client"
import { type DatabaseTransaction } from "~/server/database/client"
import { SessionService } from "~/server/services"
import { ProcessStatus, SessionStatus } from "~/shared/const";
import type { GetSessionByStatus, Session } from "~/shared/dto/session.dto";
import { completeWithTransaction } from "../database/helpers";

export const SessionUseCase = {

  /**
   * Обрабатывает текущую `ACTIVE` сессию пользователя.
   * проверяет инвариант единственной `ACTIVE` сессии на пользователя
   * @returns `ACTIVE` сессия пользователя либо `null`
   */
  async handlerActiveSession(userId: string, logger: Logger, tx?: DatabaseTransaction): Promise<Session | null> {
    return completeWithTransaction(async (tx) => {
      try {
        logger.info(`handler of session:: ` + ProcessStatus.PENDING, { sessionStatus: SessionStatus.ACTIVE })

        logger.info(`Get session by status:: ` + ProcessStatus.PENDING, { sessionStatus: SessionStatus.ACTIVE })
        const sessions = await SessionService.getByStatus({
          status: SessionStatus.ACTIVE,
          userId,
        }, tx)
        logger.info(`Get session by status:: ` + ProcessStatus.COMPLETE, { sessionStatus: SessionStatus.ACTIVE })

        if (!sessions.length) {
          return null
        }

        // ACTIVE сессия - одна
        if (sessions.length === 1) {
          return sessions[0] ?? null
        }

        // ACTIVE sessions больше чем 1
        if (sessions.length > 1) {
          //  Сортируем по возрастанию CreatedAt
          sessions.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
          const mostFreshlySession = sessions.pop()!
          for (const s of sessions) {
            const success = await SessionService.terminate(s.id, tx)
            if (!success) {
              logger.error(`session with id=${s.id} processing ended with an error`)
              throw new Error(`session with id=${s.id} processing ended with an error`)
            }
          }
          logger.warn(`Amount of sessions greater than 1. Violation invariant`, { sessionStatus: SessionStatus.ACTIVE })
          return mostFreshlySession
        }

        return null
      } catch (err) {
        logger.error('Error during handle session:: ' + ProcessStatus.ERROR, { sessionStatus: SessionStatus.ACTIVE, err })
        throw 'ERROR'
      }
      finally {
        logger.info(`handler of session:: ` + ProcessStatus.COMPLETE, { sessionStatus: SessionStatus.ACTIVE })
      }
    }, tx)
  },
  /**
 * Обрабатывает текущую `PENDING` сессию пользователя.
 * проверяет инвариант единственной `PENDING` сессии на пользователя
 * @returns `PENDING` сессия пользователя либо `null`
 */
  async handlerPendingSession(userId: string, logger: Logger, tx?: DatabaseTransaction) {
    return completeWithTransaction(async (tx) => {
      try {
        logger.info(`handler of session:: ` + ProcessStatus.PENDING, { sessionStatus: SessionStatus.PENDING })

        logger.info(`Get session by status:: ` + ProcessStatus.PENDING, { sessionStatus: SessionStatus.PENDING })
        const sessions = await SessionService.getByStatus({
          status: SessionStatus.PENDING,
          userId,
        }, tx)
        logger.info(`Get session by status:: ` + ProcessStatus.COMPLETE, { sessionStatus: SessionStatus.PENDING })

        if (!sessions.length) {
          return null
        }

        // PENDING сессия - одна
        if (sessions.length === 1) {
          return sessions[0] ?? null
        }

        // PENDING sessions больше чем 1
        if (sessions.length > 1) {
          //  Сортируем по возрастанию CreatedAt
          sessions.sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
          const mostFreshlySession = sessions.pop()!
          for (const s of sessions) {
            const success = await SessionService.terminate(s.id, tx)
            if (!success) {
              logger.error(`session with id=${s.id} processing ended with an error`)
              throw new Error(`session with id=${s.id} processing ended with an error`)
            }
          }
          logger.warn(`Amount of sessions greater than 1. Violation invariant`, { sessionStatus: SessionStatus.PENDING })
          return mostFreshlySession
        }

        return null
      } catch (err) {
        logger.error('Error during handle session:: ' + ProcessStatus.ERROR, { sessionStatus: SessionStatus.PENDING, err })
        throw 'ERROR'
      }
      finally {
        logger.info(`handler of session:: ` + ProcessStatus.COMPLETE, { sessionStatus: SessionStatus.PENDING })
      }
    }, tx)
  },

  async getSessionByStatus(dto: GetSessionByStatus, logger: Logger) {
    // инварианты:
    /*
      1. сессия со статусом ACTIVE у пользователя может быть только одна.
        в случае если мы нашли больше чем одну такую сессию, то мы оставляем самую свежую (с самым большим created_at)
        а все остальные удаляем
      2. сессия со статусом PENDING также может быть у пользователя только одна. если находим несколько таких на пользователя
        то также удаляем все кроме самой новой
    */
    return await completeWithTransaction(async tx => {
      logger.info('Find session by status:: ' + ProcessStatus.PENDING)
      const session = await SessionUseCase.handlerActiveSession(dto.userId, logger, tx)
      logger.debug('COMPLETE HANDLER ACTION SESSION', { session })
      // const sessions = await SessionService.getByStatus(dto, tx)
      // // Если получаем с PENDING статусом
      // if (dto.status === SessionStatus.PENDING) {
      //   if (sessions.length === 1) {
      //     return sessions[0]
      //   }
      //   if (sessions.length > 1) {
      //     logger.warn('Sessions with PENDING status greater than 1. Violation invariant')
      //   }
      // }
      // logger.info('Find session by status:: ' + ProcessStatus.COMPLETE)

    })
  },


  async TerminateExtraSessions() {

  },
}
