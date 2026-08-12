import React from 'react';
import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { LayoutDashboard, BarChart3, PieChart, History, Trophy, User } from 'lucide-react';

export const RootLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-300 flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-wider">Loading account</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sticky Navigation Footer */}
      <nav className="md:hidden sticky bottom-0 z-40 bg-[#0B0E14]/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around py-2 px-1 text-[10px] font-mono">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/market"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <BarChart3 className="w-4 h-4" />
          <span>Market</span>
        </NavLink>

        <NavLink
          to="/portfolio"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <PieChart className="w-4 h-4" />
          <span>Portfolio</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <History className="w-4 h-4" />
          <span>Logs</span>
        </NavLink>

        <NavLink
          to="/leaderboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <Trophy className="w-4 h-4" />
          <span>Ranks</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${isActive ? 'text-emerald-400 font-bold' : 'text-slate-400'}`
          }
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
