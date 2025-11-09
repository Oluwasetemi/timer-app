import { useState } from 'react';

interface TimeSlotFormProps {
  onAdd: (title: string, duration: number) => void;
}

export function TimeSlotForm({ onAdd }: TimeSlotFormProps) {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds === 0) {
      alert('Please set a duration');
      return;
    }

    onAdd(title, totalSeconds);
    setTitle('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <form onSubmit={handleSubmit} className="timeslot-form">
      <h2>Create Time Slot</h2>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Presentation, Break, Q&A"
        />
      </div>
      <div className="form-group duration-inputs">
        <label>Duration</label>
        <div className="duration-controls">
          <div className="duration-input">
            <input
              type="number"
              min="0"
              max="23"
              value={hours}
              onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <span>hours</span>
          </div>
          <div className="duration-input">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <span>minutes</span>
          </div>
          <div className="duration-input">
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value) || 0))}
            />
            <span>seconds</span>
          </div>
        </div>
      </div>
      <button type="submit" className="btn-add">Add Time Slot</button>
    </form>
  );
}
