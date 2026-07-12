import z from "zod";

export const signInDto = z.object({
  username: z.string().trim().min(3),
  password: z.string().trim().min(3),
})

export type SignInDto = z.infer<typeof signInDto>
