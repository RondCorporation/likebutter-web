'use client';

import { useState } from 'react';

export default function LazyYoutube({
  videoId,
  className = '',
}: {
  videoId: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className={`relative aspect-video w-full cursor-pointer ${className}`}
      onClick={() => setPlay(true)}
    >
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={thumb}
            alt="video thumbnail"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center text-white text-5xl">
            ▶
          </span>
        </>
      )}
    </div>
  );
}
