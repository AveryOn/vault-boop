import type { SignUpDto } from "~/shared/dto/auth.dto"
import type { Logger } from "~/shared/logger/logger.client"
import { db } from "~/server/database/client"
import { hashPassword } from "../utils/crypto"
import { UserService } from '~/server/services/user.service';
import { ActionService, SessionService, UserActionService } from "../services"
import { ActionKey } from "~/shared/dto/action.dto"
import { ProcessStatus } from "~/shared/const";

export const SignupUseCase = {
  async createUserKey(dto: SignUpDto, logger: Logger) {
    return await db.transaction(async (tx) => {
      logger.info('Find User By Username:: ' + ProcessStatus.PENDING)
      const existsUser = await UserService.getByUsername(dto.username, tx)
      if (existsUser) {
        logger.error('Conflict: User with such username already exists')
        throw new Error('Conflict')
      }
      logger.info('Find User By Username:: ' + ProcessStatus.COMPLETE)


      logger.info('Create new user:: ' + ProcessStatus.PENDING)
      // Создание нового пользователя
      const newUser = await UserService.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        password: await hashPassword(dto.password),
        username: dto.password,
      }, tx)
      logger.info('Create new user:: ' + ProcessStatus.COMPLETE)


      logger.info('Get Action by name:: ' + ProcessStatus.PENDING)
      const action = await ActionService.getByName(ActionKey.SessionCreated, tx)
      if (!action) {
        logger.error(`Action ${ActionKey.SessionCreated} not found`, { action: ActionKey.SessionCreated })
        throw new Error(`Action ${action} not found`)
      }
      logger.info('Get Action by name:: ' + ProcessStatus.COMPLETE)


      logger.info('Create new User Action:: ' + ProcessStatus.PENDING)
      const newUserAction = await UserActionService.create(
        { userId: newUser.id },
        { actionId: action.id, comment: ActionKey.SessionCreated },
        tx,
      )
      logger.info('Create new User Action:: ' + ProcessStatus.COMPLETE)


      logger.info('Create new Session:: ' + ProcessStatus.PENDING)
      const session = await SessionService.create({
        lastUserActionId: newUserAction.id,
        userId: newUser.id,
      }, tx)
      logger.info('Create new Session:: ' + ProcessStatus.COMPLETE, { session })
    })
  }
}
