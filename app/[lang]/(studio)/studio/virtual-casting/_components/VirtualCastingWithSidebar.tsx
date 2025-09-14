'use client';

import { useState, useCallback } from 'react';
import StudioLayout from '../../_components/StudioLayout';
import VirtualCastingClient from './VirtualCastingClient';
import VirtualCastingSidebar from './VirtualCastingSidebar';

interface VirtualCastingFormData {
  selectedCharacter: {
    category: string;
    name: string;
    image: string;
  } | null;
}

export default function VirtualCastingWithSidebar() {
  const [formData, setFormData] = useState<VirtualCastingFormData>({
    selectedCharacter: null,
  });

  const handleFormChange = useCallback((newFormData: VirtualCastingFormData) => {
    setFormData(newFormData);
  }, []);

  return (
    <StudioLayout
      sidebar={<VirtualCastingSidebar onFormChange={handleFormChange} />}
      bottomSheetOptions={{
        initialHeight: 60,
        maxHeight: 90,
        minHeight: 40,
      }}
    >
      <VirtualCastingClient formData={formData} />
    </StudioLayout>
  );
}