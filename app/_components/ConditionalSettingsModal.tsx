'use client';

import { useAuthStore } from '@/stores/authStore';
import SettingsModal from './SettingsModal';

export default function ConditionalSettingsModal() {
  const { isInitialized } = useAuthStore();

  if (!isInitialized) {
    return null;
  }

  return <SettingsModal />;
}
