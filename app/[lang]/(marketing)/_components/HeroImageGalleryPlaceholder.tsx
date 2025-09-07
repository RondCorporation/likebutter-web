'use client';

export default function HeroImageGalleryPlaceholder() {
  return (
    <div
      className="relative"
      style={{
        position: 'absolute',
        width: '1650px',
        height: '830px',
        left: '50%',
        transform: 'translateX(-810px)',
        opacity: 0.3,
      }}
    >
      {[
        { left: 0, top: 0 }, // 1번
        { left: 0, top: 430 }, // 2번
        { left: 330, top: 200 }, // 3번
        { left: 660, top: 350 }, // 4번
        { left: 990, top: 200 }, // 5번
        { left: 1320, top: 0 }, // 6번
        { left: 1320, top: 430 }, // 7번
      ].map((position, index) => (
        <div
          key={index}
          className="absolute bg-gray-800/30 animate-pulse"
          style={{
            left: position.left,
            top: position.top,
            width: '300px',
            height: '400px',
            borderRadius: '20px',
          }}
        />
      ))}
    </div>
  );
}
