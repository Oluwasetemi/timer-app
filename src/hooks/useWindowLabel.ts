import { useState, useEffect } from 'react';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export function useWindowLabel() {
  const [label, setLabel] = useState<string>('main');

  useEffect(() => {
    // Ensure Tauri is available before trying to get window info
    const getWindowLabel = async () => {
      try {
        // Check if we're in a Tauri context
        if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
          const webviewWindow = getCurrentWebviewWindow();
          setLabel(webviewWindow.label);
        }
      } catch (error) {
        console.warn('Failed to get window label:', error);
        // Keep default 'main' label if Tauri APIs aren't available
      }
    };

    getWindowLabel();
  }, []);

  return label;
}
