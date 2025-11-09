import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { useTimeSlots } from "./hooks/useTimeSlots";
import { useWindowLabel } from "./hooks/useWindowLabel";
import { TimeSlotForm } from "./components/TimeSlotForm";
import { TimeSlotList } from "./components/TimeSlotList";
import { Timer } from "./components/Timer";
import { ViewMode, TimeSlot } from "./types";

function App() {
  const {
    slots,
    addSlot,
    deleteSlot,
    startSlot,
    pauseSlot,
    resumeSlot,
    completeSlot,
    resetSlot,
  } = useTimeSlots();

  const windowLabel = useWindowLabel();
  const [viewMode, setViewMode] = useState<ViewMode>("normal");
  const [currentSlotId, setCurrentSlotId] = useState<string | null>(() => {
    return localStorage.getItem('current-slot-id');
  });

  // Sync currentSlotId to localStorage
  useEffect(() => {
    if (currentSlotId) {
      localStorage.setItem('current-slot-id', currentSlotId);
    } else {
      localStorage.removeItem('current-slot-id');
    }
  }, [currentSlotId]);

  // Listen for currentSlotId changes from other windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'current-slot-id') {
        setCurrentSlotId(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const currentSlot = slots.find(s => s.id === currentSlotId) || null;

  const handleAddSlot = (title: string, duration: number) => {
    addSlot(title, duration);
  };

  const handleStartSlot = (slot: TimeSlot) => {
    startSlot(slot.id);
    setCurrentSlotId(slot.id);
  };

  const handlePauseSlot = () => {
    if (currentSlot) {
      pauseSlot(currentSlot.id);
    }
  };

  const handleResumeSlot = () => {
    if (currentSlot) {
      resumeSlot(currentSlot.id);
    }
  };

  const handleCompleteSlot = async () => {
    if (currentSlot) {
      completeSlot(currentSlot.id);

      // Send notification
      try {
        await invoke("send_notification", {
          title: "Timer Completed",
          body: `"${currentSlot.title}" has finished!`,
        });
      } catch (error) {
        console.error("Failed to send notification:", error);
      }

      // Don't clear currentSlotId - keep showing the completed timer
      // setCurrentSlotId(null);
    }
  };

  const handleRestartSlot = () => {
    if (currentSlot) {
      resetSlot(currentSlot.id);
      startSlot(currentSlot.id);
    }
  };

  const handleDeleteSlot = (id: string) => {
    if (currentSlotId === id) {
      setCurrentSlotId(null);
    }
    deleteSlot(id);
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "normal" ? "projection" : "normal"));
  };

  const handleOpenProjectionWindow = async () => {
    try {
      await invoke("open_projection_window");
    } catch (error) {
      console.error("Failed to open projection window:", error);
    }
  };

  const handleCloseProjectionWindow = async () => {
    try {
      await invoke("close_projection_window");
    } catch (error) {
      console.error("Failed to close projection window:", error);
    }
  };

  // activeSlot is already defined from currentSlot above

  // If this is the projection window, always show projection view
  if (windowLabel === "projection") {
    return (
      <div className="app-projection">
        <button className="btn-exit-projection" onClick={handleCloseProjectionWindow}>
          Close Projection Window
        </button>
        {currentSlot && (currentSlot.startTime || currentSlot.isPaused || currentSlot.isCompleted) ? (
          <Timer
            slot={currentSlot}
            onComplete={handleCompleteSlot}
            onPause={handlePauseSlot}
            onResume={handleResumeSlot}
            onRestart={handleRestartSlot}
            isProjection={true}
          />
        ) : (
          <div className="projection-empty">
            <h1>No Active Timer</h1>
            <p>Start a timer in the main window to see it here</p>
          </div>
        )}
      </div>
    );
  }

  // Main window - in-app projection mode
  if (viewMode === "projection") {
    return (
      <div className="app-projection">
        <button className="btn-exit-projection" onClick={toggleViewMode}>
          Exit Projection
        </button>
        {currentSlot && (currentSlot.startTime || currentSlot.isPaused || currentSlot.isCompleted) ? (
          <Timer
            slot={currentSlot}
            onComplete={handleCompleteSlot}
            onPause={handlePauseSlot}
            onResume={handleResumeSlot}
            onRestart={handleRestartSlot}
            isProjection={true}
          />
        ) : (
          <div className="projection-empty">
            <h1>No Active Timer</h1>
            <p>Start a timer to see it in projection mode</p>
            <button onClick={toggleViewMode}>Go Back</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Timer App</h1>
        {currentSlot && (
          <div className="header-buttons">
            <button className="btn-projection" onClick={toggleViewMode}>
              Full Screen
            </button>
            <button className="btn-projection" onClick={handleOpenProjectionWindow}>
              Project to Window
            </button>
          </div>
        )}
      </header>

      <div className="app-content">
        <div className="left-panel">
          <TimeSlotForm onAdd={handleAddSlot} />
          <TimeSlotList
            slots={slots}
            onStart={handleStartSlot}
            onDelete={handleDeleteSlot}
            currentSlot={currentSlot}
          />
        </div>

        <div className="right-panel">
          {currentSlot && (currentSlot.startTime || currentSlot.isPaused || currentSlot.isCompleted) ? (
            <Timer
              slot={currentSlot}
              onComplete={handleCompleteSlot}
              onPause={handlePauseSlot}
              onResume={handleResumeSlot}
              onRestart={handleRestartSlot}
            />
          ) : (
            <div className="timer-placeholder">
              <p>Select a time slot to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
