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
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <div
      className={`relative aspect-video w-full cursor-pointer ${className}`}
      onClick={() => setPlay(true)}
    >
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={videoSrc}
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
            onError={(e) =>
              (e.currentTarget.src =
                'https://via.placeholder.com/640x360.png?text=Video')
            }
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg
              className="h-16 w-16 text-white opacity-80 transition-opacity hover:opacity-100"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
