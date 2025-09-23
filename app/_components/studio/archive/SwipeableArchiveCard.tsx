'use client';

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Trash2 } from 'lucide-react';
import { Task } from '@/types/task';

interface SwipeableArchiveCardProps {
  task: Task;
  children: React.ReactNode;
  onDelete: (task: Task) => void;
}

export default function SwipeableArchiveCard({
  task,
  children,
  onDelete,
}: SwipeableArchiveCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const handlers = useSwipeable({
    onSwipeStart: () => {
      setSwipeOffset(0);
    },
    onSwiping: (eventData) => {
      if (eventData.deltaX < 0) {
        const offset = Math.min(0, Math.max(-80, eventData.deltaX));
        setSwipeOffset(offset);
      }
    },
    onSwipedLeft: (eventData) => {
      if (eventData.deltaX < -40) {
        setSwipeOffset(-80);
        setIsRevealed(true);
      } else {
        setSwipeOffset(0);
        setIsRevealed(false);
      }
    },
    onSwipedRight: () => {
      setSwipeOffset(0);
      setIsRevealed(false);
    },
    onTap: () => {
      if (isRevealed) {
        setSwipeOffset(0);
        setIsRevealed(false);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 10,
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task);

    setSwipeOffset(0);
    setIsRevealed(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Delete button (revealed on swipe) */}
      <div
        className="absolute right-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center transition-all duration-200 ease-out"
        style={{
          transform: `translateX(${isRevealed ? '0' : '100'}%)`,
        }}
      >
        <button
          onClick={handleDeleteClick}
          className="p-3 text-white hover:bg-red-600 rounded-full transition-colors"
          aria-label="삭제"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      {/* Main card content */}
      <div
        {...handlers}
        className="relative transition-transform duration-200 ease-out touch-pan-y"
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
