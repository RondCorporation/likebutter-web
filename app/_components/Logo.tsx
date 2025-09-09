'use client';

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
  return (
    // <div
    //   onClick={onClick}
    //   className={`text-lg font-bold text-accent transition-colors hover:text-yellow-300 ${className}`}
    // >
    //   {text}
    // </div>
    <div
      onClick={onClick}
      className={`text-[#ffd93b] text-xl leading-7 ${className}`}
      style={{ fontFamily: 'Archivo Black, Helvetica' }}
    >
      {text}
    </div>
  );
}
