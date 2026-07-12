import z from "zod";

export const signInDto = z.object({
  username: z.string().trim().min(3),
  password: z.string().trim().min(3),
})
export type SignInDto = z.infer<typeof signInDto>


export const signUpDto = z.object({
  username: z.string().trim().min(3),
  password: z.string().trim().min(3),
})
export type SignUpDto = z.infer<typeof signUpDto>


