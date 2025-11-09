export interface TimeSlot {
  id: string;
  title: string;
  duration: number; // in seconds - original duration
  remainingTime?: number; // in seconds - time left when paused
  startTime?: number; // timestamp when timer starts
  endTime?: number; // timestamp when timer should end
  isPaused: boolean;
  isCompleted: boolean;
  createdAt: number;
}

export interface TimerState {
  currentSlot: TimeSlot | null;
  remainingTime: number; // in seconds
  isRunning: boolean;
}

export type ViewMode = 'normal' | 'projection';
