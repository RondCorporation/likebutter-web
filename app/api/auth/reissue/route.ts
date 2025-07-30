import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 개발 환경에서 reissue endpoint 중복 문제 예방을 위해 proxy 없이 호출
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const refreshTokenCookie = cookieStore.get('refreshToken');

  if (!refreshTokenCookie) {
    return NextResponse.json(
      { message: 'No refresh token found' },
      { status: 401 }
    );
  }

  try {
    const backendRes = await fetch(`${API_URL}/auth/reissue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!backendRes.ok) {
      const errorBody = await backendRes.json();
      console.error('Backend reissue failed:', backendRes.status, errorBody);
      return NextResponse.json(errorBody, { status: backendRes.status });
    }

    const responseBody = await backendRes.json();
    const newAccessTokenValue = responseBody.data?.accessToken;
    const newRefreshTokenValue = responseBody.data?.refreshToken;
    const cookieOptionsFromBackend = responseBody.data?.cookieOptions;

    if (!newAccessTokenValue || !cookieOptionsFromBackend) {
      console.error('Invalid response from backend:', responseBody);
      return NextResponse.json(
        { message: 'Invalid response from backend' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { success: true, newAccessToken: newAccessTokenValue },
      { status: 200 }
    );

    // Base options from backend
    const baseOptions: any = {
      path: cookieOptionsFromBackend.path,
      secure: cookieOptionsFromBackend.secure,
      sameSite: cookieOptionsFromBackend.same_site,
    };

    // Conditionally add the domain if it exists
    if (cookieOptionsFromBackend.domain) {
      baseOptions.domain = cookieOptionsFromBackend.domain;
    }

    // Access Token: httpOnly: false for client-side access
    response.cookies.set('accessToken', newAccessTokenValue, {
      ...baseOptions,
      httpOnly: false,
      maxAge: cookieOptionsFromBackend.max_age_access,
    });

    // Refresh Token: httpOnly: true for security
    if (newRefreshTokenValue) {
      response.cookies.set('refreshToken', newRefreshTokenValue, {
        ...baseOptions,
        httpOnly: true,
        maxAge: cookieOptionsFromBackend.max_age_refresh,
      });
    }

    return response;
  } catch (error) {
    console.error('Error during token reissue via Route Handler:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
