'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

export default function HelpClient() {
  const { t } = useTranslation(['studio', 'common']);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqSections: FAQSection[] = [
    {
      title: t('studio:faq.imageGeneration.title'),
      items: [
        {
          question: t(
            'studio:faq.imageGeneration.whatIsImageGeneration.question'
          ),
          answer: t('studio:faq.imageGeneration.whatIsImageGeneration.answer'),
        },
        {
          question: t('studio:faq.imageGeneration.availableStyles.question'),
          answer: t('studio:faq.imageGeneration.availableStyles.answer'),
        },
        {
          question: t('studio:faq.imageGeneration.uploadConditions.question'),
          answer: t('studio:faq.imageGeneration.uploadConditions.answer'),
        },
        {
          question: t('studio:faq.imageGeneration.generationTime.question'),
          answer: t('studio:faq.imageGeneration.generationTime.answer'),
        },
        {
          question: t('studio:faq.imageGeneration.uploadTips.question'),
          answer: t('studio:faq.imageGeneration.uploadTips.answer'),
        },
      ],
    },
    {
      title: t('studio:faq.audioGeneration.title'),
      items: [
        {
          question: t(
            'studio:faq.audioGeneration.whatIsAudioGeneration.question'
          ),
          answer: t('studio:faq.audioGeneration.whatIsAudioGeneration.answer'),
        },
        {
          question: t('studio:faq.audioGeneration.conditionsAndTime.question'),
          answer: t('studio:faq.audioGeneration.conditionsAndTime.answer'),
        },
        {
          question: t('studio:faq.audioGeneration.canEditResults.question'),
          answer: t('studio:faq.audioGeneration.canEditResults.answer'),
        },
        {
          question: t('studio:faq.audioGeneration.uploadTips.question'),
          answer: t('studio:faq.audioGeneration.uploadTips.answer'),
        },
      ],
    },
    {
      title: t('studio:faq.common.title'),
      items: [
        {
          question: t('studio:faq.common.howToSaveResults.question'),
          answer: t('studio:faq.common.howToSaveResults.answer'),
        },
        {
          question: t('studio:faq.common.getBetterResults.question'),
          answer: t('studio:faq.common.getBetterResults.answer'),
        },
        {
          question: t('studio:faq.common.unsatisfiedResults.question'),
          answer: t('studio:faq.common.unsatisfiedResults.answer'),
        },
      ],
    },
  ];

  return (
    <div className="w-full min-h-full bg-[#25282c] pb-28 md:pb-0">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('studio:faq.title')}
          </h1>
          <p className="text-[#a8a8aa] text-lg max-w-2xl mx-auto">
            {t('studio:faq.subtitle')}
          </p>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center">
                {section.title}
              </h2>

              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const itemId = `${sectionIndex}-${itemIndex}`;
                  const isOpen = openItems.has(itemId);

                  return (
                    <div
                      key={itemId}
                      className="bg-[#202020] border border-[#4a4a4b] rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#323232] transition-colors"
                      >
                        <h3 className="font-semibold text-white pr-4">
                          {item.question}
                        </h3>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#a8a8aa] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#a8a8aa] flex-shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-4 border-t border-[#4a4a4b]">
                          <p className="text-[#c3c3c5] leading-relaxed mt-3">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
