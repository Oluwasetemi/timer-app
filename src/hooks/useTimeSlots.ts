import { useState, useEffect, useCallback } from 'react';
import { TimeSlot } from '../types';

const STORAGE_KEY = 'timer-app-slots';

export function useTimeSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  }, [slots]);

  // Listen for storage changes from other windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSlots(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addSlot = useCallback((title: string, duration: number) => {
    const newSlot: TimeSlot = {
      id: crypto.randomUUID(),
      title,
      duration,
      isPaused: false,
      isCompleted: false,
      createdAt: Date.now(),
    };
    setSlots((prev) => [...prev, newSlot]);
    return newSlot;
  }, []);

  const deleteSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  }, []);

  const startSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          const now = Date.now();
          return {
            ...slot,
            startTime: now,
            endTime: now + slot.duration * 1000,
            isPaused: false,
          };
        }
        return slot;
      })
    );
  }, []);

  const pauseSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId && slot.startTime && slot.endTime) {
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((slot.endTime - now) / 1000));
          return {
            ...slot,
            remainingTime: remaining,
            isPaused: true,
            startTime: undefined,
            endTime: undefined,
          };
        }
        return slot;
      })
    );
  }, []);

  const resumeSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId && slot.isPaused) {
          const now = Date.now();
          const timeToUse = slot.remainingTime ?? slot.duration;
          return {
            ...slot,
            startTime: now,
            endTime: now + timeToUse * 1000,
            isPaused: false,
            remainingTime: undefined,
          };
        }
        return slot;
      })
    );
  }, []);

  const completeSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            isCompleted: true,
            isPaused: false,
          };
        }
        return slot;
      })
    );
  }, []);

  const resetSlot = useCallback((slotId: string) => {
    setSlots((prev) =>
      prev.map((slot) => {
        if (slot.id === slotId) {
          return {
            ...slot,
            remainingTime: undefined,
            startTime: undefined,
            endTime: undefined,
            isPaused: false,
            isCompleted: false,
          };
        }
        return slot;
      })
    );
  }, []);

  return {
    slots,
    addSlot,
    deleteSlot,
    startSlot,
    pauseSlot,
    resumeSlot,
    completeSlot,
    resetSlot,
  };
}
