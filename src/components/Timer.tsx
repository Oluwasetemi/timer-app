import { useEffect, useState, useRef } from 'react';
import { TimeSlot } from '../types';

interface TimerProps {
  slot: TimeSlot;
  onComplete: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  isProjection?: boolean;
}

export function Timer({ slot, onComplete, onPause, onResume, onRestart, isProjection = false }: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const warningTriggered = useRef({
    fifty: false,
    seventyFive: false,
    ninety: false,
  });

  // Reset warning triggers when slot changes or restarts
  useEffect(() => {
    warningTriggered.current = {
      fifty: false,
      seventyFive: false,
      ninety: false,
    };
  }, [slot.id, slot.startTime]);

  useEffect(() => {
    // If paused, show the remaining time stored in the slot
    if (slot.isPaused && slot.remainingTime !== undefined) {
      setRemainingTime(slot.remainingTime);
      return;
    }

    // If not started yet or completed, don't update
    if (!slot.startTime || slot.isCompleted) {
      return;
    }

    const calculateRemaining = () => {
      if (!slot.endTime) return 0;
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((slot.endTime - now) / 1000));
      return remaining;
    };

    setRemainingTime(calculateRemaining());

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingTime(remaining);

      // Calculate percentage of time elapsed
      const percentElapsed = slot.duration > 0 ? ((slot.duration - remaining) / slot.duration) * 100 : 0;

      // Check warning thresholds based on percentage
      if (percentElapsed >= 50 && percentElapsed < 50.5 && !warningTriggered.current.fifty) {
        // 50% of duration elapsed - 3 second flash
        warningTriggered.current.fifty = true;
        triggerWarningFlash(3000);
      } else if (percentElapsed >= 75 && percentElapsed < 75.5 && !warningTriggered.current.seventyFive) {
        // 75% of duration elapsed - 5 second flash
        warningTriggered.current.seventyFive = true;
        triggerWarningFlash(5000);
      } else if (percentElapsed >= 90 && percentElapsed < 90.5 && !warningTriggered.current.ninety) {
        // 90% of duration elapsed - 10 second flash
        warningTriggered.current.ninety = true;
        triggerWarningFlash(10000);
      }

      if (remaining === 0) {
        onComplete();
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [slot.startTime, slot.endTime, slot.isPaused, slot.isCompleted, slot.remainingTime, onComplete]);

  const triggerWarningFlash = (duration: number) => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), duration);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = slot.duration > 0 ? ((slot.duration - remainingTime) / slot.duration) * 100 : 0;

  if (isProjection) {
    return (
      <div className="timer-projection">
        <h1 className="timer-title">{slot.title}</h1>
        <div className={`timer-display ${showWarning || slot.isCompleted ? 'warning' : ''}`}>
          {formatTime(remainingTime)}
        </div>
        <div className="progress-container">
          <div className={`progress-bar ${showWarning || slot.isCompleted ? 'warning' : ''}`} style={{ width: `${progress}%` }}></div>
        </div>
        {slot.isCompleted && (
          <div className="timer-completed-message">
            <p className="completed-text">Time Up!</p>
            <button onClick={onRestart} className="btn-restart-projection">
              Restart Timer
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="timer-normal">
      {slot.isCompleted && <span className="completed-badge">Time Up</span>}
      <h3>{slot.title}</h3>
      <div className={`timer-time ${slot.isCompleted ? 'completed' : ''}`}>
        {formatTime(remainingTime)}
      </div>
      <div className="timer-progress">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="timer-controls">
        {slot.isCompleted ? (
          <button onClick={onRestart}>Restart</button>
        ) : slot.isPaused ? (
          <button onClick={onResume}>Resume</button>
        ) : (
          <button onClick={onPause}>Pause</button>
        )}
      </div>
    </div>
  );
}
