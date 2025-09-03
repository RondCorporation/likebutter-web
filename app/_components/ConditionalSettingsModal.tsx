'use client';

import { useAuthContext } from '@/app/_contexts/AuthContext';
import SettingsModal from './SettingsModal';

export default function ConditionalSettingsModal() {
  const { shouldInitializeAuth } = useAuthContext();

  if (!shouldInitializeAuth) {
    return null;
  }

  return <SettingsModal />;
}
