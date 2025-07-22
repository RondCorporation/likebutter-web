'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  text?: string;
  onClick?: () => void;
  href?: string;
}

export default function Logo({
  className = '',
  text = 'LikeButter',
  onClick,
  href = '/',
}: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-lg font-bold text-accent transition-colors hover:text-yellow-300 ${className}`}
    >
      {text}
    </Link>
  );
}
