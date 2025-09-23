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
