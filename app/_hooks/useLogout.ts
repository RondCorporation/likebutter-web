import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { logout as apiLogout, clearSession } from '@/lib/apis/auth.api';

export function useLogout() {
  const router = useRouter();
  const logoutStore = useAuthStore((s) => s.logout);

  const logout = async () => {
    try {
      // 정상 로그아웃: 토큰이 유효한 경우 서버에서 DB 정리 + 쿠키 삭제
      await apiLogout();
    } catch (error) {
      // 토큰이 만료되었거나 인증 오류인 경우 강제 세션 정리
      try {
        await clearSession();
      } catch (clearError) {
        // 강제 세션 정리도 실패한 경우 (네트워크 오류 등)
        console.warn('Failed to clear session:', clearError);
      }
    } finally {
      // 클라이언트 상태 정리 및 라우팅
      logoutStore();
      router.replace('/login');
    }
  };

  return logout;
}
