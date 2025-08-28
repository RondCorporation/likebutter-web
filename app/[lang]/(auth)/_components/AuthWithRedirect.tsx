'use client';

import { useEffect, useState, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getMe } from '@/lib/apis/user.api';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

/**
 * 이 컴포넌트는 로그인 및 회원가입 같은 인증 페이지를 감싸는 역할을 합니다.
 * 주된 목적은 클라이언트 사이드에서 사용자가 이미 인증되었는지 확인하는 것입니다.
 * 인증된 사용자라면, 인증 페이지에서 벗어나 메인 애플리케이션(`/studio`)으로 리디렉션합니다.
 * 인증되지 않은 사용자라면, 자식 컴포넌트(로그인/회원가입 폼)를 렌더링합니다.
 */
export default function AuthWithRedirect({ children }: { children: ReactNode }) {
  // 'checking': 사용자의 토큰을 확인하는 초기 상태
  // 'authenticated': 사용자가 확인되었으며, 리디렉션이 임박한 상태
  // 'unauthenticated': 사용자가 로그인하지 않았으므로, 폼을 보여줘야 하는 상태
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hydrate } = useAuthStore.getState();

  useEffect(() => {
    // 이 효과는 클라이언트에서 인증 상태를 확인하기 위해 한 번만 실행됩니다.
    const verifyUserSession = async () => {
      try {
        // 사용자 데이터 가져오기를 시도합니다.
        // `getMe` 함수는 내부적으로 `apiFetch`를 사용하며,
        // 이 함수는 초기 액세스 토큰이 만료되었을 경우 쿠키를 통해 자동으로 토큰을 갱신합니다.
        console.log("인증 페이지에서 사용자 세션을 확인합니다...");
        const response = await getMe();

        if (response.data) {
          // 성공: 토큰이 유효하거나 성공적으로 갱신되었습니다.
          console.log("이미 인증된 사용자입니다. 리디렉션합니다...");
          hydrate(response.data); // 전역 auth 스토어에 최신 사용자 데이터를 채웁니다.
          setAuthStatus('authenticated');

          // 리디렉션 URL을 결정합니다.
          const lang = pathname.split('/')[1] || 'ko';
          const returnTo = searchParams.get('returnTo');
          // 'returnTo' 파라미터가 있으면 사용하고, 없으면 /studio 페이지로 기본 설정합니다.
          const redirectUrl = returnTo ? decodeURIComponent(returnTo) : `/${lang}/studio`;
          
          // 전체 페이지 리디렉션을 수행합니다. 이는 router.replace()보다 더 확실한 방법으로,
          // 인증된 앱 영역으로 진입할 때 모든 레이아웃과 서버 상태가 올바르게 재평가되도록 보장합니다.
          window.location.replace(redirectUrl);

        } else {
          // 이 경우는 거의 발생하지 않지만, 안전을 위해 처리합니다.
          setAuthStatus('unauthenticated');
        }
      } catch (error) {
        // 실패: `getMe` 호출이 실패했습니다. 이는 신규 사용자나 로그아웃한 사용자에게
        // 예상되는 결과이며, 토큰이 없거나 유효하지 않기 때문입니다.
        console.log("인증되지 않은 사용자입니다. 인증 페이지를 표시합니다.");
        setAuthStatus('unauthenticated');
      }
    };

    verifyUserSession();
    // 의존성 배열은 린터 규칙을 만족시키기 위해 포함되었지만,
    // 실제로는 컴포넌트 마운트 시 한 번만 실행되도록 설계되었습니다.
  }, [pathname, searchParams, hydrate]);

  // 세션을 확인 중이거나, 인증된 사용자의 리디렉션을 기다리는 동안 로딩 스피너를 표시합니다.
  // 이를 통해 이미 로그인한 사용자에게 로그인 폼이 깜박이며 나타나는 현상을 방지합니다.
  if (authStatus !== 'unauthenticated') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoaderCircle size={40} className="animate-spin text-accent" />
      </div>
    );
  }

  // 확인 절차가 완료되고 사용자가 미인증 상태임이 확인되면, 자식 컴포넌트를 렌더링합니다.
  return <>{children}</>;
}