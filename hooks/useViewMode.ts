import { useCallback, useMemo, useState } from 'react';

export type ViewMode = 'admin' | 'rider';

const storageKey = (userId: string) => `mymotolog_viewMode_${userId}`;

const readMode = (userId?: string): ViewMode => {
  if (!userId) return 'rider';
  try {
    return localStorage.getItem(storageKey(userId)) === 'admin' ? 'admin' : 'rider';
  } catch {
    return 'rider';
  }
};

// Remembered per account on each device. Read straight from storage, so the first paint
// after signing in already shows the right mode.
export const useViewMode = (userId?: string) => {
  const [changes, setChanges] = useState(0);
  const viewMode = useMemo(() => readMode(userId), [userId, changes]);

  const setViewMode = useCallback((mode: ViewMode) => {
    if (!userId) return;
    try {
      localStorage.setItem(storageKey(userId), mode);
    } catch {
      // Storage blocked (private mode) - the choice just won't be remembered
    }
    setChanges(count => count + 1);
  }, [userId]);

  return { viewMode, setViewMode };
};
