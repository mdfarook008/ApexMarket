import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  History,
  Trophy,
  User,
  Zap,
  Star,
  ExternalLink
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Market Directory', icon: BarChart3, path: '/market' },
    { label: 'Portfolio', icon: PieChart, path: '/portfolio' },
    { label: 'Transaction Logs', icon: History, path: '/history' },
    { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { label: 'User Profile', icon: User, path: '/profile' }
  ];

  return (
    <aside className="w-64 bg-[#0B0E14] border-r border-surface-50/50 min-h-[calc(100vh-65px)] hidden md:flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Quick Simulator Mode Tag */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-white">Paper Trading Engine</span>
            <span className="block text-[10px] text-emerald-400/90 font-mono font-medium">Real-Time Simulation</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          <span className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Navigation
          </span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Pro Tip */}
      <div className="p-3.5 rounded-2xl bg-surface-200/80 border border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-[11px]">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>Paper Trading Tip</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Practice risk management by setting strict position sizing on virtual cash (default ₹1,00,000).
        </p>
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 hover:underline pt-1"
        >
          <span>TradingView Feed</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
