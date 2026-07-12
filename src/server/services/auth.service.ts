import { db } from "~/server/database/client";
import { actionTable, userTable } from "../database/schema";
import { eq } from "drizzle-orm";
import type { Action, CreateActionDto } from "~/shared/dto/action.dto";
import { dateISO } from "~/shared/utils/datetime";
import type { SignInDto } from "~/shared/dto/auth.dto";
import type { Logger } from "~/shared/logger/logger.client";
import { UserService } from "./user.service";
import { ProcessStatus } from "~/shared/const";


export const AuthService = {
  async signUp(dto: SignInDto, logger: Logger) {
    try {
      logger.info('[STAGE_1]:: Get user by username:: ' + ProcessStatus.PENDING, { username: dto.username })
      const user = await UserService.getByUsername(dto.username)

      // Если такого юзера нет существует то запрещаем вход
      if (!user) {
        logger.error(
          '[STAGE_1]:: Get user by username:: ' + ProcessStatus.ERROR,
          {
            username: dto.username,
            note: 'User with such username is not found'
          }
        )
        throw new Error('User with such username is not found')
      }
      logger.info('[STAGE_1]:: Get user by username:: ' + ProcessStatus.COMPLETE, { note: `username - ${dto.username} is founded` })


      // STAGE_2 - Проверка пароля
      logger.info('[STAGE_2]:: ')

    }
    catch (err) {
      logger.error('Error', { err })
    }
  }
}
