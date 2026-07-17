import type { SignInDto, SignUpDto } from "~/shared/dto/auth.dto"
import type { Logger } from "~/shared/logger/logger.client"
import { db } from "~/server/database/client"
import { hashPassword } from "~/server/utils/crypto"
import { UserService } from '~/server/services/user.service';
import { ActionRepo } from "~/server/repo/action.repo"
import { UserActionRepo } from "~/server/repo/user-action.repo"
import { ActionKey } from "~/shared/dto/action.dto"
import { ProcessStatus } from "~/shared/const";
import { HttpStatusCode } from "axios";
import { UserRepo } from "~/server/repo/user.repo";

export const AuthService = {

  async signUp(dto: SignUpDto, logger: Logger) {
    return await db.transaction(async (tx) => {
      try {

        // CHECK USER BY USERNAME
        logger.info('Find User By Username:: ' + ProcessStatus.PENDING)
        const existsUser = await UserRepo.getByUsername(dto.username, tx)
        if (existsUser) {
          logger.error('Conflict: User with such username already exists')
          throw new Error('Conflict')
        }
        logger.info('Find User By Username:: ' + ProcessStatus.COMPLETE)


        // CREATE NEW USER
        logger.info('Create new user:: ' + ProcessStatus.PENDING)
        // Создание нового пользователя
        const newUser = await UserRepo.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: await hashPassword(dto.password),
          username: dto.username,
        }, tx)
        logger.info('Create new user:: ' + ProcessStatus.COMPLETE)


        // GET ACTION BY ID
        logger.info('Get Action by name:: ' + ProcessStatus.PENDING)
        const action = await ActionRepo.getByName(ActionKey.SessionCreated, tx)
        if (!action) {
          logger.error(`Action ${ActionKey.SessionCreated} not found`, { action: ActionKey.SessionCreated })
          throw new Error(`Action ${action} not found`)
        }
        logger.info('Get Action by name:: ' + ProcessStatus.COMPLETE)

        // CREATE NEW USER_ACTION
        logger.info('Create new User Action:: ' + ProcessStatus.PENDING)
        await UserActionRepo.create(
          { userId: newUser.id },
          { actionId: action.id, comment: ActionKey.SessionCreated },
          tx,
        )
        logger.info('Create new User Action:: ' + ProcessStatus.COMPLETE)
      }
      catch (err) {
        logger.error('Sign-Up Error', { err })
        throw err
      }

    })
  },

  async signIn(dto: SignInDto, logger: Logger) {
    return await db.transaction(async (tx) => {
      try {
        // Найти пользователя по username
        logger.info('Find User By Username:: ' + ProcessStatus.PENDING)
        const user = await UserService.getByUsername(dto.username, tx)
        if (!user) {
          logger.error('User not found', { status: HttpStatusCode.NotFound })
          throw new Error('Not Found')
        }
        logger.info('Find User By Username:: ' + ProcessStatus.COMPLETE)

        logger.info('Password Check:: ' + ProcessStatus.PENDING)
        const hashedPassword = await hashPassword(dto.password)
        if (user.masterPasswordHash !== hashedPassword) {
          logger.error('Password Check:: ' + ProcessStatus.ERROR, { msg: 'passwords mismatch' })
          throw 'Unauthorized'
        }
        logger.info('Password Check:: ' + ProcessStatus.COMPLETE)

        // SessionUseCase.getSessionByStatus({
        //   status: SessionStatus.PENDING
        //   dto
        // })
        // FIND SESSION
        // logger.info('Find user session:: ' + ProcessStatus.PENDING)
        // const  = await SessionService.getByStatus({
        //   status: SessionStatus.ACTIVE
        // }, tx)
      } catch (err) {
        logger.error('Sign-In Error', { err })
        throw err
      }
    })
  }
}
