import z from "zod";

export const signInDto = z.object({
  username: z.string().trim().min(3),
  password: z.string().trim().min(3),
})
export type SignInDto = z.infer<typeof signInDto>


export const signUpDto = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must contain at least 3 characters'),
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters'),
  lastName: z
    .string()
    .trim()
    .min(2, 'Last name must contain at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters'),

})
export type SignUpDto = z.infer<typeof signUpDto>


