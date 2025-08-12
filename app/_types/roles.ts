export const ALL_ROLES = [
  'ROLE_GUEST',
  'ROLE_USER',
  'ROLE_FREE',
  'ROLE_CREATOR',
  'ROLE_PROFESSIONAL',
  'ROLE_ENTERPRISE',
  'ROLE_MANAGER',
  'ROLE_ADMIN',
] as const;

export type Role = (typeof ALL_ROLES)[number];
