export const API_TAGS = {
  AUTH: {
    USER: "AUTH_USER",
    SESSION: "AUTH_SESSION",
  },
  USERS: {
    LIST: "USERS_LIST",
    DETAIL: "USERS_DETAIL",
  },
} as const;

export type TApiTags = typeof API_TAGS;
