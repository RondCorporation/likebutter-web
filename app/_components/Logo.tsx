'use client';

import { useRouter, usePathname } from 'next/navigation';

interface LogoProps {
  className?: string;
  text?: string;
  onClick?: () => void;
}

export default function Logo({
  className = '',
  text = 'LikeButter',
  onClick,
}: LogoProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // 현재 언어 추출 후 해당 언어의 랜딩페이지로 이동
      const lang = pathname.split('/')[1];
      router.push(`/${lang}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`text-[#ffd93b] text-xl leading-7 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
      style={{ fontFamily: 'Archivo Black, Helvetica' }}
    >
      {text}
    </div>
  );
}
