import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ExercisePicker from '../components/ExercisePicker';
import ExerciseCard from '../components/ExerciseCard';

const API_BASE_URL = 'http://localhost:5001';

function CreateRoutine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const isViewMode = searchParams.get('mode') === 'view';
  const isEditing = Boolean(id) && !isViewMode;

  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    async function init() {
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
        if (profileRes.status === 404) { navigate('/profile-setup'); return; }

        if (!id) { setLoading(false); return; }

        const routinesRes = await fetch(`${API_BASE_URL}/api/routines`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!routinesRes.ok) { setError('Unable to load routine.'); setLoading(false); return; }

        const all = await routinesRes.json();
        const routine = all.find((r) => r._id === id);
        if (!routine) { setError('Routine not found.'); setLoading(false); return; }

        setName(routine.name || '');
        setExercises(
          (routine.exercises || []).map((ex) => ({
            exerciseId: ex.exerciseId || ex._id || '',
            name: ex.name || '',
            primaryMuscle: ex.primaryMuscle || '',
            sets: ex.sets ?? ex.defaultSets ?? '',
            reps: ex.reps ?? ex.defaultReps ?? '',
            youtubeLink: ex.youtubeLink || ''
          }))
        );
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [id, navigate]);

  function handleSelectExercise(exercise) {
    setExercises((prev) => [
      ...prev,
      {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        primaryMuscle: exercise.primaryMuscle || '',
        sets: exercise.sets ?? '',
        reps: exercise.reps ?? '',
        youtubeLink: exercise.youtubeLink || ''
      }
    ]);
  }

  function handleUpdateExercise(index, field, value) {
    setExercises((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function handleRemoveExercise(index) {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!name.trim()) { setError('Routine name is required.'); return; }

    const payload = {
      name: name.trim(),
      exercises: exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        name: ex.name,
        primaryMuscle: ex.primaryMuscle,
        sets: ex.sets !== '' ? Number(ex.sets) : undefined,
        reps: ex.reps !== '' ? Number(ex.reps) : undefined,
        youtubeLink: ex.youtubeLink || undefined
      }))
    };

    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/routines${isEditing ? `/${id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Unable to save routine.'); setSaving(false); return; }
      navigate('/routines');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-400">Loading routine…</p>
      </main>
    );
  }

  // ─── Page title & subtitle based on mode ─────────────────────────────────
  const pageTitle = isViewMode ? name || 'Routine' : isEditing ? 'Edit routine' : 'Create routine';
  const pageSubtitle = isViewMode
    ? `${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'}`
    : 'Define a template you can reuse for future workouts.';

  return (
    <>
      <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
        <div className="mx-auto max-w-2xl">

          {/* Header */}
          <header className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/routines')}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              aria-label="Back"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight">{pageTitle}</h1>
              <p className="mt-0.5 text-xs text-slate-400">{pageSubtitle}</p>
            </div>
            {/* In view mode, show an Edit shortcut */}
            {isViewMode && (
              <button
                type="button"
                onClick={() => navigate(`/routines/${id}`)}
                className="flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-800"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            )}
          </header>

          {/* ── View mode: read-only list ─────────────────────────────────── */}
          {isViewMode ? (
            <div className="mt-6 space-y-3">
              {exercises.length === 0 ? (
                <p className="text-sm text-slate-500">This routine has no exercises yet.</p>
              ) : (
                exercises.map((exercise, index) => (
                  <ExerciseCard
                    key={index}
                    exercise={exercise}
                    index={index}
                    viewMode
                    // onUpdate / onRemove intentionally omitted — card ignores them in viewMode
                  />
                ))
              )}
            </div>
          ) : (
            /* ── Edit / Create mode: full form ─────────────────────────────── */
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              {/* Routine name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-200">Routine name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Push day, Pull day, Upper body…"
                />
              </div>

              {/* Exercises section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-medium text-slate-200">Exercises</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {exercises.length === 0
                        ? 'Add exercises from your library.'
                        : `${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'} added`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="flex items-center gap-1.5 rounded-md border border-slate-700 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add exercise
                  </button>
                </div>

                {exercises.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="w-full rounded-xl border border-dashed border-slate-700 py-8 text-center text-xs text-slate-500 hover:border-slate-600 hover:text-slate-400"
                  >
                    <svg className="mx-auto mb-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Tap to add your first exercise
                  </button>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <ExerciseCard
                        key={index}
                        exercise={exercise}
                        index={index}
                        onUpdate={handleUpdateExercise}
                        onRemove={() => handleRemoveExercise(index)}
                      />
                    ))}
                  </div>
                )}
              </section>

              {error && (
                <p className="text-sm text-red-400" role="alert">{error}</p>
              )}

              <div className="flex gap-3 pt-1 pb-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {saving ? 'Saving…' : isEditing ? 'Update routine' : 'Create routine'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/routines')}
                  className="flex-1 rounded-md border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {showPicker && (
        <ExercisePicker
          onSelectExercise={handleSelectExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}

export default CreateRoutine;