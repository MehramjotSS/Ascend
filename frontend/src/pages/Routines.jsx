import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

function RoutineCard({ routine, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Derive unique muscle groups from exercises
  const muscles = [
    ...new Set(
      (routine.exercises || [])
        .map((ex) => ex.primaryMuscle)
        .filter(Boolean)
    )
  ];

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        {/* Info */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-slate-100">{routine.name}</h2>

          {muscles.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {muscles.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                >
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-[11px] text-slate-500">No exercises yet</p>
          )}

          <p className="mt-2 text-[11px] text-slate-500">
            {routine.exercises?.length || 0}{' '}
            {routine.exercises?.length === 1 ? 'exercise' : 'exercises'}
          </p>
        </div>

        {/* Three-dot menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            aria-label="Options"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-10 min-w-[150px] rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl">
              {/* View */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/routines/${routine._id}?mode=view`);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
              >
                <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(`/routines/${routine._id}`);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800"
              >
                <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <div className="my-1 border-t border-slate-800" />

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(routine._id);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-slate-800"
              >
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Routines() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    async function load() {
      try {
        const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
        if (profileRes.status === 404) { navigate('/profile-setup'); return; }

        const res = await fetch(`${API_BASE_URL}/api/routines`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) { setError('Unable to load routines.'); setLoading(false); return; }

        setRoutines(await res.json());
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  async function handleDelete(id) {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch(`${API_BASE_URL}/api/routines/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRoutines((prev) => prev.filter((r) => r._id !== id));
    } catch { /* silent */ }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Routines</h1>
            <p className="mt-1 text-xs text-slate-400">Reusable templates for your workouts.</p>
          </div>
          <Link
            to="/routines/new"
            className="flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create routine
          </Link>
        </header>

        {loading && (
          <p className="mt-8 text-sm text-slate-400">Loading your routines…</p>
        )}

        {!loading && error && (
          <p className="mt-8 text-sm text-red-400" role="alert">{error}</p>
        )}

        {!loading && !error && routines.length === 0 && (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <div className="rounded-full bg-slate-800/60 p-4">
              <svg className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">No routines yet</p>
            <p className="max-w-xs text-xs text-slate-500">
              Create your first routine to build a reusable workout template.
            </p>
            <Link
              to="/routines/new"
              className="mt-1 rounded-md bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400"
            >
              Create your first routine
            </Link>
          </div>
        )}

        {!loading && !error && routines.length > 0 && (
          <div className="mt-5 space-y-3">
            {routines.map((routine) => (
              <RoutineCard key={routine._id} routine={routine} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Routines;