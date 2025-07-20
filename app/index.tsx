import { useRootNavigationState, useRouter } from 'expo-router';
import React, { useEffect } from 'react';


export default function AppIndex(): React.ReactElement | null {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  
  useEffect(() => {
    if (rootNavigationState?.key) {
      router.replace('/(sidemenu)' as any);
    }
  }, [rootNavigationState?.key]);
  
  return null;

  
}