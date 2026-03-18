import '../styles/components.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ExerciseBottomSheet from '../components/ExcersizeBottomSheet';

const API_BASE_URL = 'http://localhost:5001';

function StartWorkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const routine = location.state;

  // ── Workout state ──────────────────────────────────────────────────────────
  const [workout, setWorkout] = useState(
    routine.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      name: ex.name,
      primaryMuscle: ex.primaryMuscle || '',
      completed: false,
      sets: [
        { weight: '', reps: '' },
        { weight: '', reps: '' }
      ]
    }))
  );

  // Index of the exercise whose sheet is open; null = closed
  const [activeIndex, setActiveIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  // ── Sheet handlers ─────────────────────────────────────────────────────────
  function openSheet(index) {
    setActiveIndex(index);
  }

  function closeSheet() {
    setActiveIndex(null);
  }

  // Called by sheet when "Done" is tapped
  function handleDone() {
    // Mark current exercise completed
    setWorkout((prev) =>
      prev.map((ex, i) => (i === activeIndex ? { ...ex, completed: true } : ex))
    );

    // Auto-open next incomplete exercise, or close if all done
    const nextIndex = workout.findIndex(
      (ex, i) => i > activeIndex && !ex.completed
    );
    if (nextIndex !== -1) {
      setActiveIndex(nextIndex);
    } else {
      setActiveIndex(null);
    }
  }

  // Called by sheet to update sets for one exercise
  function handleUpdateSets(exIndex, newSets) {
    setWorkout((prev) =>
      prev.map((ex, i) => (i === exIndex ? { ...ex, sets: newSets } : ex))
    );
  }

  // ── Save workout ───────────────────────────────────────────────────────────
  async function handleFinish() {
    const token = localStorage.getItem('token');
    const payload = {
      routineId: routine._id,
      routineName: routine.name,
      exercises: workout.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        sets: ex.sets
          .filter((s) => s.weight !== '' || s.reps !== '')
          .map((s) => ({
            weight: Number(s.weight) || 0,
            reps: Number(s.reps) || 0
          }))
      }))
    };

    setSaving(true);
    try {
      await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      navigate('/');
    } catch {
      setSaving(false);
    }
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const completedCount = workout.filter((ex) => ex.completed).length;
  const totalCount = workout.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const activeExercise = activeIndex !== null ? workout[activeIndex] : null;

  return (
    <>
      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-slate-950 text-slate-100 px-4 py-6 pb-28">
        <div className="mx-auto max-w-lg">

          {/* Header */}
          <header className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                aria-label="Back"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">{routine.name}</h1>
                <p className="text-xs text-slate-500">
                  {completedCount} of {totalCount} exercises done
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-full rounded-full bg-slate-800 overflow-hidden mt-3">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </header>

          {/* Exercise list */}
          <div className="space-y-2.5">
            {workout.map((ex, index) => {
              const filledSets = ex.sets.filter(
                (s) => s.weight !== '' && s.reps !== ''
              ).length;
              const isActive = activeIndex === index;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => openSheet(index)}
                  className={`
                    w-full rounded-xl border px-4 py-3.5 text-left transition-colors
                    ${ex.completed
                      ? 'border-emerald-800/50 bg-emerald-500/5'
                      : isActive
                        ? 'border-emerald-600/40 bg-slate-900'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Completion indicator */}
                      <div className={`
                        shrink-0 flex h-6 w-6 items-center justify-center rounded-full
                        ${ex.completed
                          ? 'bg-emerald-500'
                          : 'border-2 border-slate-700'
                        }
                      `}>
                        {ex.completed && (
                          <svg className="h-3.5 w-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className={`truncate text-sm font-medium ${
                          ex.completed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-100'
                        }`}>
                          {ex.name}
                        </p>
                        {ex.primaryMuscle && (
                          <p className="text-[10px] text-slate-500 mt-0.5">{ex.primaryMuscle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Sets progress badge */}
                      {filledSets > 0 && !ex.completed && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                          {filledSets}/{ex.sets.length} sets
                        </span>
                      )}
                      {ex.completed && (
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          {ex.sets.length} sets
                        </span>
                      )}

                      {/* Chevron */}
                      {!ex.completed && (
                        <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky finish button */}
      <div className="fixed bottom-14 md:bottom-0 inset-x-0 px-4 py-3 bg-slate-950/90 backdrop-blur-sm border-t border-slate-800">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={handleFinish}
            disabled={saving}
            className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : completedCount === totalCount && totalCount > 0
              ? '🎉 Finish Workout'
              : `Finish Workout (${completedCount}/${totalCount})`}
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      {activeExercise !== null && (
        <ExerciseBottomSheet
          exercise={activeExercise}
          exIndex={activeIndex}
          onUpdate={handleUpdateSets}
          onClose={closeSheet}
          onDone={handleDone}
        />
      )}
    </>
  );
}

export default StartWorkout;