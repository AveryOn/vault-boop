import { db } from "~/server/database/client"
import { userTable } from "../database/schema"
import { eq } from "drizzle-orm"
import type { SignUpDto } from "~/shared/dto/auth.dto"
import type { Logger } from "~/shared/logger/logger.client"


export const UserKeyUseCase = {

}
