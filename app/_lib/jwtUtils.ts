import { jwtDecode } from 'jwt-decode';

interface JWTPayload {
  sub: string; // user ID
  email?: string;
  roles?: string[];
  exp: number; // expiration time
  iat: number; // issued at
}

/**
 * JWT 토큰에서 사용자 정보를 추출합니다.
 * 새로고침 시 /users/me API 호출을 피하기 위함입니다.
 */
export function extractUserFromJWT(token: string): {
  isAuthenticated: boolean;
  userInfo: {
    id: string;
    email?: string;
    roles: string[];
  } | null;
  isExpired: boolean;
} {
  try {
    const payload = jwtDecode<JWTPayload>(token);

    // 토큰 만료 확인
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < now;

    if (isExpired) {
      return {
        isAuthenticated: false,
        userInfo: null,
        isExpired: true,
      };
    }

    // JWT에서 기본 사용자 정보 추출
    return {
      isAuthenticated: true,
      userInfo: {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      },
      isExpired: false,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      userInfo: null,
      isExpired: true,
    };
  }
}

/**
 * 쿠키에서 JWT 토큰 추출
 */
export function getJWTFromCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const match = document.cookie.match(new RegExp(`(^| )accessToken=([^;]+)`));
  return match ? match[2] : null;
}

/**
 * 관리자 권한 확인 (JWT에서)
 */
export function isAdminFromJWT(token: string): boolean {
  const { userInfo } = extractUserFromJWT(token);
  return userInfo?.roles.includes('ROLE_ADMIN') || false;
}
