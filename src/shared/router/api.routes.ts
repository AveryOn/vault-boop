export const apiRoutes = {
  client: {
    Health: '/api/health',
    Projects: '/api/projects',
    Articles: '/api/articles',
  },

  admin: {
    // EMPLOYMENT TYPE
    CvEmploymentTypes: `/api/cv/employment-types`,

    // PROFILES
    CvProfiles: '/api/cv/profiles',
    CvProfilesActive: '/api/cv/profiles/active',
    cvProfileByUuid: (uuid: string) => `/api/cv/profiles/${uuid}`,

    // EXPERIENCE
    CvExperiences: '/api/cv/experiences',

    // LANGUAGES
    CvLanguages: '/api/cv/languages',

    // LINKS
    CvLinks: '/api/cv/links',
    CvLinksReorder: '/api/cv/links/reorder',
    cvLinkByUuid: (uuid: string) => `/api/cv/links/${uuid}`,

    // PROJECTS
    CvProjects: '/api/cv/projects',

    // SKILLS
    CvSkills: '/api/cv/skills',

    // TEMPLATES
    CvTemplates: '/api/cv/templates',

    // VERSIONS
    CvVersions: '/api/cv/versions',
  },
} as const
