export const clientRoutes = {
  Home: '/',
  AboutMe: '/about-me',
  News: '/news',
  Projects: '/projects',
  newsDetails: (uuid: string) => `/news/${uuid}`,
  projectDetails: (uuid: string) => `/projects/${uuid}`,
}
