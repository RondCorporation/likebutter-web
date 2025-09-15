'use client';

import { useState, useCallback } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import FanmeetingStudioClient from './FanmeetingStudioClient';
import FanmeetingStudioSidebar from './FanmeetingStudioSidebar';

interface FanmeetingFormData {
  backgroundPrompt: string;
  situationPrompt: string;
}

export default function FanmeetingStudioWithSidebar() {
  const [formData, setFormData] = useState<FanmeetingFormData>({
    backgroundPrompt: '',
    situationPrompt: '',
  });

  const handleFormChange = useCallback((newFormData: FanmeetingFormData) => {
    setFormData(newFormData);
  }, []);

  return (
    <StudioLayout
      sidebar={<FanmeetingStudioSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 50,
        maxHeight: 90,
        minHeight: 30,
      }}
    >
      <FanmeetingStudioClient formData={formData} />
    </StudioLayout>
  );
}