const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const OAUTH_GOOGLE = `${API_BASE}/oauth2/authorize/google`;
export const OAUTH_FACEBOOK = `${API_BASE}/oauth2/authorize/facebook`;
export const OAUTH_X = `${API_BASE}/oauth2/authorize/twitter`;