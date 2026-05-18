export const DIFFICULTY_LEVELS = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  expert: {
    label: 'Expert',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CURRENT_USER: '/auth/current-user',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/update-profile',
    UPLOAD_AVATAR: '/users/upload-avatar',
    CHANGE_PASSWORD: '/users/change-password',
    DELETE_ACCOUNT: '/users/delete-account',
  },
  JOURNAL: {
    LIST: '/journals',
    RECENT: '/journals/recent',
    DETAIL: '/journals',
    CREATE: '/journals',
    UPDATE: '/journals',
    DELETE: '/journals',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    WEEKLY_SUMMARY: '/dashboard/weekly-summary',
    RECENT_TOPICS: '/dashboard/recent-topics',
    PRODUCTIVITY: '/dashboard/productivity',
    ANALYTICS: '/dashboard/analytics',
  },
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};
