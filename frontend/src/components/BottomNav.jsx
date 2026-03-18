import { Home, Dumbbell, BarChart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Routine', icon: Dumbbell, path: '/routines' },
    { name: 'Analysis', icon: BarChart, path: '/analysis' },
    { name: 'Me', icon: User, path: '/profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur border-t border-slate-800 flex justify-around py-2 z-50">

      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;

        return (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 text-xs"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? 'text-white' : 'text-slate-500'}
            />
            <span className={isActive ? 'text-white' : 'text-slate-500'}>
              {tab.name}
            </span>
          </button>
        );
      })}

    </div>
  );
}

export default BottomNav;