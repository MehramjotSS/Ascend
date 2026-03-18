import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProfileSetup from './pages/ProfileSetup';
import Routines from './pages/Routines';
import CreateRoutine from './pages/CreateRoutine';
import AppLayout from './components/AppLayout';
import StartWorkout from './pages/StartWorkout';


const API_BASE_URL = 'http://localhost:5001';

function RootRedirect() {
  const navigate = useNavigate();

  // Simple effect-only component to decide where to send the user on app load
  // without introducing global state.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    async function checkProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
          return;
        }

        if (res.status === 404) {
          navigate('/profile-setup', { replace: true });
          return;
        }

        navigate('/dashboard', { replace: true });
      } catch (_err) {
        navigate('/login', { replace: true });
      }
    }

    checkProfile();
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/routines" element={<Routines />} />
          <Route path="/routines/new" element={<CreateRoutine />} />
          <Route path="/routines/:id" element={<CreateRoutine />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/workout" element={<StartWorkout />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

