// Definition des endpoints
// Utiliser des constantes permet de changer facilement les URLs si le backend Django évolue

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    REGISTER: "/auth/register/",
    LOGOUT: "/auth/logout/",
    REFRESH: "/auth/token/refresh/",
    ME: "/auth/users/me/",
  },
  USERS: {
    PROFILE: "/users/profile/",
    UPDATE_PROFILE: "/users/profile/update/",
    CHILDREN: "/users/children/",
  },
  SUBSCRIPTION: {
    PLANS: "/subscription/plans/",
    CREATE_CHECKOUT_SESSION: "/subscription/create-checkout-session/",
    STATUS: "/subscription/status/",
  },
  CONTENT: {
    COURSES: "/content/courses/",
    LESSONS: (courseId: string) => `/content/courses/${courseId}/lessons/`,
    PROGRESS: "/content/progress/",
  },
} as const;
