import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

function ProfileSetup() {
  const navigate = useNavigate();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (res.status === 404) {
          // No profile yet – first-time setup
          setIsEditing(false);
          setInitialLoading(false);
          return;
        }

        if (!res.ok) {
          setError('Unable to load profile. Please try again.');
          setInitialLoading(false);
          return;
        }

        const data = await res.json();
        setHeight(data.height?.toString() ?? '');
        setWeight(data.weight?.toString() ?? '');
        setExperienceLevel(data.experienceLevel || 'beginner');
        setIsEditing(true);
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    }

    loadProfile();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const numericHeight = Number(height);
    const numericWeight = Number(weight);

    if (!Number.isFinite(numericHeight) || !Number.isFinite(numericWeight)) {
      setError('Height and weight must be numbers');
      return;
    }

    const allowedLevels = ['beginner', 'intermediate', 'advanced'];
    if (!allowedLevels.includes(experienceLevel)) {
      setError('Please select a valid experience level');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          height: numericHeight,
          weight: numericWeight,
          experienceLevel
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Unable to save profile');
        setLoading(false);
        return;
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <p className="text-sm text-slate-300">Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-md sm:max-w-lg px-6 py-8 rounded-xl border border-slate-800 bg-slate-900/70 shadow-lg shadow-black/40">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          {isEditing ? 'Update your profile' : 'Set up your profile'}
        </h1>
        <p className="mt-2 text-sm text-slate-400 text-center">
          Tell Ascend a bit about you to personalize your training later.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-200">Height (cm)</label>
            <input
              type="number"
              inputMode="decimal"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 175"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-200">Weight (kg)</label>
            <input
              type="number"
              inputMode="decimal"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. 72"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-slate-200">Experience level</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <label
                  key={level}
                  className="flex-1 inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="experience"
                    value={level}
                    checked={experienceLevel === level}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="h-4 w-4 text-emerald-500"
                  />
                  <span className="capitalize text-slate-200">{level}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Save Profile'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ProfileSetup;

