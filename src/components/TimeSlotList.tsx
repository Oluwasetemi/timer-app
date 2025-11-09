import { TimeSlot } from '../types';

interface TimeSlotListProps {
  slots: TimeSlot[];
  onStart: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
  currentSlot: TimeSlot | null;
}

export function TimeSlotList({ slots, onStart, onDelete, currentSlot }: TimeSlotListProps) {
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

    return parts.join(' ');
  };

  return (
    <div className="timeslot-list">
      <h2>Time Slots</h2>
      {slots.length === 0 ? (
        <p className="empty-message">No time slots yet. Create one to get started!</p>
      ) : (
        <ul>
          {slots.map((slot) => {
            const isActive = currentSlot?.id === slot.id;
            const isCompleted = slot.isCompleted;

            return (
              <li key={slot.id} className={`timeslot-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                <div className="timeslot-info">
                  <span className="timeslot-title">{slot.title}</span>
                  <span className="timeslot-duration">{formatDuration(slot.duration)}</span>
                </div>
                <div className="timeslot-actions">
                  {!isCompleted && !isActive && (
                    <button onClick={() => onStart(slot)} className="btn-start">
                      Start
                    </button>
                  )}
                  {isCompleted && <span className="status-badge">Time Up</span>}
                  {isActive && !isCompleted && <span className="status-badge">Running</span>}
                  <button onClick={() => onDelete(slot.id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
