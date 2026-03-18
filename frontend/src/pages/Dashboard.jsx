import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Hi there');
  const [dateLabel, setDateLabel] = useState('');
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const today = new Date();
    setDateLabel(
      today.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      })
    );

    async function load() {
      try {
        const authRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (authRes.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!authRes.ok) {
          setGreeting('Welcome back');
          setLoading(false);
          return;
        }

        const authData = await authRes.json();
        setGreeting(authData.name ? `Hi, ${authData.name}` : 'Hi there');

        const profileRes = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileRes.status === 404) {
          navigate('/profile-setup');
          return;
        }

        if (!profileRes.ok) {
          setLoading(false);
          return;
        }

        const routinesRes = await fetch(`${API_BASE_URL}/api/routines`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (routinesRes.ok) {
          const data = await routinesRes.json();
          setRoutines(data); // ⚠️ changed (we need full list)
        }
      } catch (_err) {
        // Keep UI simple
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  // ✅ START WORKOUT HANDLER
  function handleStartWorkout() {
    if (!routines.length) return;

    const selectedRoutine = routines[0]; // default (can upgrade later to dropdown)

    navigate('/workout', { state: selectedRoutine });
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] md:min-h-screen bg-slate-950 text-slate-100 px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        
        {/* HEADER */}
        <section className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {dateLabel || 'Today'}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              {greeting}
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Your hub for tracking progress. Workouts are coming next.
            </p>
          </div>

          {/* ✅ UPDATED BUTTON */}
          <button
            type="button"
            onClick={handleStartWorkout}
            disabled={!routines.length}
            className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            Start workout
          </button>
        </section>

        {/* ROUTINES */}
        <section className="mt-4">
          <h2 className="text-sm font-medium text-slate-200">
            Recent routines
          </h2>

          {loading && (
            <p className="mt-2 text-xs text-slate-400">
              Loading your routines...
            </p>
          )}

          {!loading && routines.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              You haven&apos;t created any routines yet. Start in the Routines tab.
            </p>
          )}

          <div className="mt-3 space-y-3">
            {routines.slice(0, 3).map((routine) => (
              <article
                key={routine._id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 flex items-center justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-medium text-slate-100">
                    {routine.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {routine.exercises?.length || 0} exercises
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/routines')}
                  className="rounded-md border border-slate-700 px-2.5 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                >
                  View
                </button>
              </article>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

export default Dashboard;