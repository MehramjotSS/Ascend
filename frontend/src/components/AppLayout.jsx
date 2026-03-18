import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  const baseClasses =
    'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium';
  const activeClasses = isActive ? 'text-emerald-400' : 'text-slate-400';

  return (
    <Link to={to} className={`${baseClasses} ${activeClasses}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-52 lg:w-64 flex-col border-r border-slate-800 bg-slate-950/80">
        <div className="px-5 py-4 border-b border-slate-800">
          <span className="text-sm font-semibold tracking-tight text-slate-100">Ascend</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 text-sm">
          <NavLink
            to="/dashboard"
            label="Dashboard"
            icon={<span className="text-lg" aria-hidden="true">🏠</span>}
          />
          <NavLink
            to="/routines"
            label="Routines"
            icon={<span className="text-lg" aria-hidden="true">📋</span>}
          />
          <NavLink
            to="/profile-setup"
            label="Profile"
            icon={<span className="text-lg" aria-hidden="true">👤</span>}
          />
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col pb-14 md:pb-0">
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
          <div className="flex justify-around py-1">
            <NavLink
              to="/dashboard"
              label="Dashboard"
              icon={<span className="text-lg" aria-hidden="true">🏠</span>}
            />
            <NavLink
              to="/routines"
              label="Routines"
              icon={<span className="text-lg" aria-hidden="true">📋</span>}
            />
            <NavLink
              to="/profile-setup"
              label="Profile"
              icon={<span className="text-lg" aria-hidden="true">👤</span>}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default AppLayout;

