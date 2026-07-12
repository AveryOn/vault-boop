export const clientRoutes = {
  Home: '/',
  AboutMe: '/about-me',
  News: '/news',
  Projects: '/projects',
  newsDetails: (uuid: string) => `/news/${uuid}`,
  projectDetails: (uuid: string) => `/projects/${uuid}`,

  Auth: '/auth',
  SignIn: '/auth/sign-in',
  SignUp: '/auth/sign-up',
} as const
