'use client';

import { useEffect, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  startDelay?: number;
  keepCursor?: boolean;
  className?: string;
}

export default function Typewriter({
  text,
  speed = 60,
  startDelay = 0,
  keepCursor = false,
  className = '',
}: Props) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timer: number;
    const begin = () => {
      let i = 0;
      const tick = () => {
        setShown(text.slice(0, i));
        if (i++ <= text.length) timer = window.setTimeout(tick, speed);
        else setDone(true);
      };
      tick();
    };
    const delayId = window.setTimeout(begin, startDelay);
    return () => {
      clearTimeout(delayId);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={`inline-block whitespace-pre-line ${className}`}>
      {shown}
      {(!done || keepCursor) && (
        <span
          className={`ml-0.5 inline-block h-[1em] w-0.5 bg-white animate-cursor`}
        />
      )}
    </span>
  );
}
