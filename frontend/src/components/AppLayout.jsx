import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Dumbbell, BarChart, User } from 'lucide-react';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Routine', path: '/routines', icon: Dumbbell },
    { name: 'Analysis', path: '/analysis', icon: BarChart },
    { name: 'Me', path: '/profile', icon: User }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:w-52 lg:w-64 flex-col border-r border-slate-800 bg-slate-950/80">
        <div className="px-5 py-4 border-b border-slate-800">
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            Ascend
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-3 py-4 text-sm">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            const Icon = tab.icon;

            return (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col pb-16 md:pb-0">
        <main className="flex-1">
          <Outlet />
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t border-slate-800 bg-slate-950/90 backdrop-blur z-50">
          <div className="flex justify-around py-2">

            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              const Icon = tab.icon;

              return (
                <button
                  key={tab.name}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center text-xs"
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className={isActive ? 'text-white' : 'text-slate-500'}
                  />
                  <span
                    className={isActive ? 'text-white mt-1' : 'text-slate-500 mt-1'}
                  >
                    {tab.name}
                  </span>
                </button>
              );
            })}

          </div>
        </nav>
      </div>
    </div>
  );
}

export default AppLayout;