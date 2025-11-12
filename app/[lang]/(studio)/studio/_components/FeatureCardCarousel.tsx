'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  route: string;
  preview: string;
  gradient?: string;
  bgColor?: string;
}

interface FeatureCardCarouselProps {
  cards: FeatureCard[];
}

export default function FeatureCardCarousel({
  cards,
}: FeatureCardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="flex flex-col md:pt-4">
      <div className="h-[28px] mb-1 md:block hidden" />
      <div className="relative">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`transition-all duration-500 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 relative'
                : 'opacity-0 absolute inset-0 pointer-events-none'
            }`}
          >
            <div
              className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => handleCardClick(card.route)}
              style={{
                background: card.gradient || card.bgColor || '#f5f5f5',
                aspectRatio: '283/165',
              }}
            >
              <Image
                src={card.preview}
                alt={card.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>
        ))}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute -right-5 top-1/2 -translate-y-1/2 w-8 h-8 border border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5 text-white stroke-[2.5]" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-[#ffd93b] w-6' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 pl-2 md:hidden">
        <h3 className="text-white font-medium text-base mb-2">
          {currentCard.title}
        </h3>
        <p className="text-[#a8a8aa] text-sm">{currentCard.description}</p>
      </div>
    </div>
  );
}
