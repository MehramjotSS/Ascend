// frontend/src/pages/Profile.jsx

import { useState, useEffect } from 'react';
import ProfileCalendar from '../components/ProfileCalender';
import '../styles/profile.css';

function deriveStats(workouts = []) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const totalWorkouts = workouts.length;

  const thisMonthWorkouts = workouts.filter((w) => {
    const d = new Date(w.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const monthlyWorkouts = thisMonthWorkouts.length;

  const monthlyPRs = thisMonthWorkouts.reduce((count, w) => {
    const prs = (w.exercises || []).filter((ex) => ex.bestSet != null).length;
    return count + prs;
  }, 0);

  const workoutDates = [
    ...new Set(thisMonthWorkouts.map((w) => new Date(w.date).getDate())),
  ];

  const workoutMap = {};

  thisMonthWorkouts.forEach((w) => {
    const day = new Date(w.date).getDate();

    let volume = 0;
    (w.exercises || []).forEach((ex) => {
      (ex.sets || []).forEach((s) => {
        volume += (s.weight || 0) * (s.reps || 0);
      });
    });

    workoutMap[day] = {
      routineName: w.routineName,
      volume,
    };
  });

  return {
    totalWorkouts,
    monthlyWorkouts,
    monthlyPRs,
    workoutDates,
    workoutMap,
  };
}

export default function Profile() {
  const now = new Date();

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    monthlyWorkouts: 0,
    monthlyPRs: 0,
    workoutDates: [],
    workoutMap: {},
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const token = localStorage.getItem('token');

        const [workoutRes, authRes] = await Promise.all([
          fetch('http://localhost:5001/api/workouts', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5001/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const workouts = await workoutRes.json();
        const authData = await authRes.json();

        if (!cancelled) {
          setStats(deriveStats(workouts));
          setUser(authData);
        }
      } catch (err) {
        console.log(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="profile-page">

      {/* HERO */}
      <div className="profile-hero">
         <h1 className="profile-name"> 
          {user?.name || user?.username || 'User'}
        </h1>
        <p className="profile-since">
          {user?.createdAt
            ? `Member since ${new Date(user.createdAt).toLocaleDateString()}`
            : ''}
        </p>
      </div>

      {/* STATS */}
      <p className="section-label">Your stats</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : stats.monthlyWorkouts}</div>
          <div className="stat-label">Workouts this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : stats.totalWorkouts}</div>
          <div className="stat-label">Total workouts</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{loading ? '—' : stats.monthlyPRs}</div>
          <div className="stat-label">PRs this month</div>
        </div>
      </div>

      <div className="profile-divider" />

      {/* CALENDAR */}
      <p className="section-label">Activity calendar</p>

      <ProfileCalendar
        month={now.getMonth()}
        year={now.getFullYear()}
        workoutDates={stats.workoutDates}
        workoutMap={stats.workoutMap}
      />

      {/* SIGN OUT */}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="mt-6 w-full text-sm text-red-400 border border-red-400/30 rounded-lg py-2 hover:bg-red-400/10"
      >
        Sign out
      </button>

    </div>
  );
}