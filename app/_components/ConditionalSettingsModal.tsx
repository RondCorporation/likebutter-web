'use client';

import { useAuthContext } from '@/app/_contexts/AuthContext';
import SettingsModal from './SettingsModal';

export default function ConditionalSettingsModal() {
  const { shouldInitializeAuth } = useAuthContext();
  
  // Only render settings modal for authenticated routes
  if (!shouldInitializeAuth) {
    return null;
  }
  
  return <SettingsModal />;
}