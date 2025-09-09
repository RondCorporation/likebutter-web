'use client';

interface BadgeProps {
  text: string;
  type?: 'info';
  className?: string;
  textClassName?: string;
}

export default function Badge({
  text,
  className = '',
  textClassName = '',
}: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 relative bg-[#4f0089] rounded overflow-hidden ${className}`}
    >
      <div
        className={`relative w-fit mt-[-1.00px] font-normal text-white text-xs tracking-[0] leading-[10px] whitespace-nowrap ${textClassName}`}
      >
        {text}
      </div>
    </div>
  );
}
