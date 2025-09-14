'use client';

import { useState, useCallback } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import StylistClient from './StylistClient';
import StylistSidebar from './StylistSidebar';

interface StylistFormData {
  mode: 'text' | 'image';
  textPrompt?: string;
  imageSettings?: {
    hairstyle: boolean;
    costume: boolean;
    background: boolean;
    accessory: boolean;
    atmosphere: boolean;
  };
}

export default function StylistWithSidebar() {
  const [formData, setFormData] = useState<StylistFormData>({
    mode: 'text',
  });

  const handleFormChange = useCallback((newFormData: StylistFormData) => {
    setFormData(newFormData);
  }, []);

  return (
    <StudioLayout
      sidebar={<StylistSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 50,
        maxHeight: 90,
        minHeight: 30,
      }}
    >
      <StylistClient formData={formData} />
    </StudioLayout>
  );
}