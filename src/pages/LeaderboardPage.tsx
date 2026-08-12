import React from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';

export const LeaderboardPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121824] via-surface-200 to-[#121824] border border-slate-700/70 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono font-semibold">
              Trader Rankings
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Leaderboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rankings based on paper portfolio yield, return percentage, and total profit.
          </p>
        </div>
      </div>

      <LeaderboardTable />
    </div>
  );
};
