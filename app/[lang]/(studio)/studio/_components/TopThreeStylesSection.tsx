'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface StyleItem {
  rank: number;
  title: string;
  description: string;
  image: string;
  route: string;
  styleParam?: string;
}

interface TopThreeStylesSectionProps {
  styles: StyleItem[];
}

export default function TopThreeStylesSection({
  styles,
}: TopThreeStylesSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleStyleClick = (route: string, styleParam?: string) => {
    const toolName = route.split('/').pop();
    const lang = pathname.split('/')[1];
    const queryParams = new URLSearchParams();
    queryParams.set('tool', toolName || '');
    if (styleParam) {
      queryParams.set('style', styleParam);
    }
    const url = `/${lang}/studio?${queryParams.toString()}`;
    router.push(url);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-white font-semibold text-lg mb-1">
        인기 스타일 TOP 3
      </h3>
      <div className="flex flex-col gap-3">
        {styles.map((style) => (
          <div
            key={style.rank}
            onClick={() => handleStyleClick(style.route, style.styleParam)}
            className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-[#1a1c20] transition-all group"
          >
            <div className="flex-shrink-0 text-2xl font-bold text-[#ffd93b] w-8">
              {style.rank}
            </div>
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={style.image}
                alt={style.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium text-sm mb-1">
                {style.title}
              </h4>
              <p className="text-[#a8a8aa] text-xs truncate">
                {style.description}
              </p>
            </div>
            <button
              className="px-4 py-2 border border-[#434343] hover:bg-[#434343]/10 text-white text-xs transition-colors whitespace-nowrap"
              style={{ borderRadius: '20px' }}
            >
              만들어보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
