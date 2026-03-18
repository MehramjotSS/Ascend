import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = 'http://localhost:5001';

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Forearms', 'Core', 'Glutes', 'Quads', 'Hamstrings',
  'Calves', 'Full Body', 'Other'
];

// ─── Custom Exercise Form ─────────────────────────────────────────────────────

function CustomExerciseForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '',
    primaryMuscle: '',
    sets: '',
    reps: '',
    youtubeLink: ''
  });
  const [error, setError] = useState('');

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAdd() {
    setError('');
    if (!form.name.trim()) { setError('Exercise name is required.'); return; }
    if (!form.primaryMuscle) { setError('Please select a muscle group.'); return; }

    onAdd({
      exerciseId: null,           // no library ID — custom exercise
      name: form.name.trim(),
      primaryMuscle: form.primaryMuscle,
      sets: form.sets !== '' ? form.sets : '',
      reps: form.reps !== '' ? form.reps : '',
      youtubeLink: form.youtubeLink.trim()
    });
  }

  return (
    <div className="space-y-3 px-4 py-4">
      {/* Name */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">
          Exercise name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          placeholder="e.g. Cable Fly, Nordic Curl…"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Muscle group */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">
          Muscle group <span className="text-red-400">*</span>
        </label>
        <select
          value={form.primaryMuscle}
          onChange={(e) => set('primaryMuscle', e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="" disabled>Select muscle group…</option>
          {MUSCLE_GROUPS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Sets & Reps */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Default sets</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={form.sets}
            onChange={(e) => set('sets', e.target.value)}
            placeholder="e.g. 3"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Default reps</label>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            value={form.reps}
            onChange={(e) => set('reps', e.target.value)}
            placeholder="e.g. 10"
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* YouTube link */}
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-300">
          YouTube link <span className="text-slate-600">(optional)</span>
        </label>
        <input
          type="url"
          value={form.youtubeLink}
          onChange={(e) => set('youtubeLink', e.target.value)}
          placeholder="https://youtube.com/watch?v=…"
          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400"
      >
        Add to routine
      </button>
    </div>
  );
}

// ─── Library Search ───────────────────────────────────────────────────────────

function LibrarySearch({ onSelect }) {
  const [exercises, setExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchExercises(searchQuery.trim());
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  async function fetchExercises(query) {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    setError('');
    try {
      const url = query
        ? `${API_BASE_URL}/api/exercises?search=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/api/exercises`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { setError('Failed to load exercises.'); setLoading(false); return; }
      setExercises(await res.json());
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  }

  // Group by primaryMuscle
  const grouped = exercises.reduce((acc, ex) => {
    const key = ex.primaryMuscle || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(ex);
    return acc;
  }, {});
  const sortedMuscles = Object.keys(grouped).sort();

  return (
    <>
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-slate-700/60">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises…"
            autoFocus
            className="w-full rounded-md border border-slate-700 bg-slate-950 pl-9 pr-8 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && (
          <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
        )}
        {!loading && error && (
          <p className="py-8 text-center text-sm text-red-400">{error}</p>
        )}
        {!loading && !error && exercises.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">
              {searchQuery ? `No results for "${searchQuery}"` : 'No exercises in library.'}
            </p>
            <p className="mt-1 text-xs text-slate-600">Try the Custom tab to add your own.</p>
          </div>
        )}
        {!loading && !error && exercises.length > 0 && (
          <div className="space-y-4">
            {sortedMuscles.map((muscle) => (
              <div key={muscle}>
                <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {muscle}
                </h3>
                <div className="space-y-1">
                  {grouped[muscle].map((ex) => (
                    <button
                      key={ex._id}
                      type="button"
                      onClick={() => onSelect(ex)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-left hover:border-emerald-500/40 hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-100">{ex.name}</p>
                          {ex.secondaryMuscles?.length > 0 && (
                            <p className="mt-0.5 truncate text-[10px] text-slate-500">
                              Also: {ex.secondaryMuscles.join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-slate-500">
                          {ex.defaultSets} × {ex.defaultReps}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main ExercisePicker ──────────────────────────────────────────────────────

function ExercisePicker({ onSelectExercise, onClose }) {
  const [tab, setTab] = useState('library'); // 'library' | 'custom'

  function handleSelectFromLibrary(exercise) {
    onSelectExercise({
      exerciseId: exercise._id,
      name: exercise.name,
      primaryMuscle: exercise.primaryMuscle || '',
      sets: exercise.defaultSets ?? '',
      reps: exercise.defaultReps ?? '',
      youtubeLink: exercise.youtubeLink || ''
    });
    onClose();
  }

  function handleAddCustom(exercise) {
    onSelectExercise(exercise);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl border border-slate-700 bg-slate-900 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3.5">
          <h2 className="text-sm font-semibold text-slate-100">Add Exercise</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          <button
            type="button"
            onClick={() => setTab('library')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === 'library'
                ? 'border-b-2 border-emerald-500 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Library
          </button>
          <button
            type="button"
            onClick={() => setTab('custom')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              tab === 'custom'
                ? 'border-b-2 border-emerald-500 text-emerald-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom
          </button>
        </div>

        {/* Tab content */}
        {tab === 'library' ? (
          // LibrarySearch has its own search bar + scrollable list
          <div className="flex flex-col flex-1 min-h-0">
            <LibrarySearch onSelect={handleSelectFromLibrary} />
          </div>
        ) : (
          // Custom form — scrollable
          <div className="flex-1 overflow-y-auto">
            <CustomExerciseForm onAdd={handleAddCustom} />
          </div>
        )}

      </div>
    </div>
  );
}

export default ExercisePicker;