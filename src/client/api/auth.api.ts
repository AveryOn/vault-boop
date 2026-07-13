import type { SignInDto, SignUpDto } from "~/shared/dto/auth.dto";
import { httpClient } from "~/client/api/http-client";
import { AppRoutes } from "~/shared/router";
const routes = AppRoutes.api.client

export const AuthApi = {
  async signIn(dto: SignInDto) {
    const result = await httpClient.post<{ data: { success: boolean } }>(routes.SignIn, dto)
    return result.data
  },

  async signUp(dto: SignUpDto) {
    return await httpClient.post<{ data: { success: boolean } }>(routes.SignUp, dto)
  }
}
