// frontend/src/components/ProfileCalendar.jsx

import { useState, useEffect } from 'react';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ProfileCalendar({
  month,
  year,
  workoutDates = [],
  workoutMap = {},
}) {
  const [popup, setPopup] = useState(null);

  const totalDays = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  const workoutSet = new Set(workoutDates);

  /* 🔥 CLOSE POPUP ON OUTSIDE CLICK + ESC */
  useEffect(() => {
    function handleClickOutside() {
      setPopup(null);
    }

    function handleEsc(e) {
      if (e.key === 'Escape') setPopup(null);
    }

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div className="calendar-card relative">

      {/* GRID */}
      <div className="calendar-grid">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} className="calendar-day" />;

          const hasWorkout = workoutSet.has(day);

          return (
            <div
              key={day}
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevent immediate close

                if (!hasWorkout) return;

                const rect = e.currentTarget.getBoundingClientRect();

                // 🔥 toggle logic
                if (popup?.day === day) {
                  setPopup(null);
                } else {
                  setPopup({
                    day,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                  });
                }
              }}
              className={`calendar-day cursor-pointer ${
                popup?.day === day ? 'bg-slate-800/60' : ''
              }`}
            >
              {day}
              {hasWorkout && <span className="calendar-dot" />}
            </div>
          );
        })}
      </div>

      {/* 🔥 ANCHORED POPUP */}
      {popup && workoutMap[popup.day] && (
        <div
          style={{
            position: 'fixed',
            top: popup.y - 8,
            left: popup.x,
            transform: 'translate(-50%, -100%)',
            zIndex: 50,
          }}
          className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-md text-[11px] shadow-lg"
        >
          <p className="text-emerald-400 font-medium">
            {workoutMap[popup.day].routineName}
          </p>
          <p className="text-slate-400">
            Vol: {workoutMap[popup.day].volume}
          </p>
        </div>
      )}

    </div>
  );
}