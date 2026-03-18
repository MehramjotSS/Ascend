import { useEffect, useRef } from 'react';

function ExerciseBottomSheet({ exercise, exIndex, onUpdate, onClose, onDone }) {
  const sheetRef = useRef(null);

  // Trap scroll inside sheet; prevent background scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on backdrop tap
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function addSet() {
    const lastSet = exercise.sets[exercise.sets.length - 1];
    onUpdate(exIndex, [...exercise.sets, { weight: '', reps: '' }]);
  }

  function repeatLast() {
    const filled = exercise.sets.filter(
      (s) => s.weight !== '' || s.reps !== ''
    );
    if (filled.length === 0) return;
    const last = filled[filled.length - 1];
    const nextSets = exercise.sets.map((s) =>
      s.weight === '' && s.reps === ''
        ? { weight: last.weight, reps: last.reps }
        : s
    );
    onUpdate(exIndex, nextSets);
  }

  function updateSet(setIndex, field, value) {
    const updated = exercise.sets.map((s, i) =>
      i === setIndex ? { ...s, [field]: value } : s
    );
    onUpdate(exIndex, updated);
  }

  const completedSets = exercise.sets.filter(
    (s) => s.weight !== '' && s.reps !== ''
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-[2px]"
      onClick={handleBackdropClick}
    >
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="
          w-full rounded-t-2xl border-t border-slate-700
          bg-slate-900 flex flex-col
          animate-slide-up
        "
        style={{ maxHeight: '75vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-slate-600" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-100 leading-snug">
                {exercise.name}
              </h2>
              {exercise.primaryMuscle && (
                <p className="mt-0.5 text-xs text-slate-500">{exercise.primaryMuscle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Close"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Last workout placeholder */}
          <div className="mt-2.5 flex items-center gap-1.5 rounded-md bg-slate-800/60 px-3 py-2">
            <svg className="h-3.5 w-3.5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-[11px] text-slate-500">
              Last workout: <span className="text-slate-400">— no data yet</span>
            </p>
          </div>
        </div>

        {/* Sets — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {/* Column labels */}
          <div className="grid grid-cols-[2rem_1fr_1fr] gap-2 mb-1">
            <span />
            <span className="text-center text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Weight (kg)
            </span>
            <span className="text-center text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Reps
            </span>
          </div>

          {exercise.sets.map((set, setIndex) => {
            const isDone = set.weight !== '' && set.reps !== '';
            return (
              <div
                key={setIndex}
                className={`grid grid-cols-[2rem_1fr_1fr] items-center gap-2 rounded-lg px-1 py-1 transition-colors ${
                  isDone ? 'bg-emerald-500/5' : ''
                }`}
              >
                {/* Set number / done indicator */}
                <div className="flex items-center justify-center">
                  {isDone ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-500">
                      {setIndex + 1}
                    </span>
                  )}
                </div>

                {/* Weight */}
                <input
                  type="number"
                  inputMode="decimal"
                  value={set.weight}
                  onChange={(e) => updateSet(setIndex, 'weight', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-center text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {/* Reps */}
                <input
                  type="number"
                  inputMode="numeric"
                  value={set.reps}
                  onChange={(e) => updateSet(setIndex, 'reps', e.target.value)}
                  placeholder="0"
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-center text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            );
          })}

          {/* Add Set */}
          <button
            type="button"
            onClick={addSet}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-700 py-2.5 text-xs text-slate-400 hover:border-slate-500 hover:text-slate-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Set
          </button>
        </div>

        {/* Footer actions */}
        <div className="px-5 pt-3 pb-6 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={repeatLast}
            className="w-full rounded-lg border border-slate-700 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Repeat Last
          </button>
          <button
            type="button"
            onClick={onDone}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            {completedSets === exercise.sets.length && completedSets > 0
              ? '✓ Done'
              : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExerciseBottomSheet;