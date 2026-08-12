import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { Trophy, Medal, Search, Flame, UserCheck } from 'lucide-react';

export const LeaderboardTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const { user, wallet, holdings } = useAuth();

  // Merge currently logged-in user dynamically into the leaderboard ranking
  const leaderboard: LeaderboardUser[] = React.useMemo(() => {
    let baseList = [...INITIAL_LEADERBOARD];

    if (user) {
      const topHolding = holdings.length > 0 ? holdings[0].assetSymbol : 'CASH';
      const userRankItem: LeaderboardUser = {
        rank: 0,
        userId: user.uid,
        displayName: `${user.displayName} (You)`,
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName)}`,
        portfolioValue: wallet.portfolioValue,
        totalProfit: wallet.totalProfitLoss,
        returnPercent: Number(wallet.totalProfitLossPercent.toFixed(2)),
        topHolding,
        badge: user.badge || '⚡ Active Trader'
      };

      // Filter out existing demo record if matching ID
      baseList = baseList.filter((u) => u.userId !== user.uid);
      baseList.push(userRankItem);
    }

    // Sort by portfolio value descending
    baseList.sort((a, b) => b.portfolioValue - a.portfolioValue);

    // Re-assign ranks
    return baseList.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [user, wallet.portfolioValue, wallet.totalProfitLoss, wallet.totalProfitLossPercent, holdings]);

  const filtered = leaderboard.filter(
    (u) =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.topHolding.toLowerCase().includes(search.toLowerCase()) ||
      u.badge.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="space-y-6 font-sans">
      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        {top3[1] && (
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col items-center text-center relative overflow-hidden order-2 md:order-1">
            <div className="absolute top-3 right-3 text-slate-400">
              <Medal className="w-6 h-6 text-slate-300" />
            </div>
            <img
              src={top3[1].avatar}
              alt={top3[1].displayName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-400 mb-3 bg-surface-200"
            />
            <span className="px-2.5 py-0.5 rounded-md bg-slate-700/60 text-slate-300 text-[10px] font-mono font-bold uppercase mb-1">
              Rank #2 Silver
            </span>
            <h4 className="font-bold text-sm text-white">{top3[1].displayName}</h4>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">
              {top3[1].badge}
            </span>

            <div className="mt-4 pt-3 border-t border-slate-800/80 w-full space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">
                Return: <span className="text-emerald-400 font-bold">+{top3[1].returnPercent}%</span>
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {formatCurrency(top3[1].portfolioValue, 'INR')}
              </div>
            </div>
          </div>
        )}

        {/* 1st Place Gold Champion */}
        {top3[0] && (
          <div className="bg-gradient-to-b from-amber-500/10 via-[#121824] to-[#121824] border border-amber-500/40 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center relative overflow-hidden order-1 md:order-2 scale-105">
            <div className="absolute top-3 right-3 text-amber-400">
              <Trophy className="w-7 h-7 text-amber-400 animate-bounce" />
            </div>
            <img
              src={top3[0].avatar}
              alt={top3[0].displayName}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-amber-400 shadow-lg shadow-amber-500/30 mb-3 bg-surface-200"
            />
            <span className="px-3 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-mono font-bold uppercase mb-1">
              🥇 Champion #1
            </span>
            <h4 className="font-bold text-base text-white">{top3[0].displayName}</h4>
            <span className="text-xs text-amber-400 font-mono font-bold mt-0.5">
              {top3[0].badge}
            </span>

            <div className="mt-4 pt-3 border-t border-amber-500/20 w-full space-y-1">
              <div className="text-xs text-slate-300 font-mono">
                Return: <span className="text-emerald-400 font-extrabold">+{top3[0].returnPercent}%</span>
              </div>
              <div className="text-sm font-mono font-extrabold text-amber-300">
                {formatCurrency(top3[0].portfolioValue, 'INR')}
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place Bronze */}
        {top3[2] && (
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl flex flex-col items-center text-center relative overflow-hidden order-3">
            <div className="absolute top-3 right-3 text-amber-600">
              <Medal className="w-6 h-6 text-amber-600" />
            </div>
            <img
              src={top3[2].avatar}
              alt={top3[2].displayName}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-amber-700 mb-3 bg-surface-200"
            />
            <span className="px-2.5 py-0.5 rounded-md bg-amber-900/40 text-amber-400 text-[10px] font-mono font-bold uppercase mb-1">
              Rank #3 Bronze
            </span>
            <h4 className="font-bold text-sm text-white">{top3[2].displayName}</h4>
            <span className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">
              {top3[2].badge}
            </span>

            <div className="mt-4 pt-3 border-t border-slate-800/80 w-full space-y-1">
              <div className="text-[11px] text-slate-400 font-mono">
                Return: <span className="text-emerald-400 font-bold">+{top3[2].returnPercent}%</span>
              </div>
              <div className="text-xs font-mono font-bold text-white">
                {formatCurrency(top3[2].portfolioValue, 'INR')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#121824] border border-slate-700/70 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Apex Paper Trading Wall of Fame</h3>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search trader or badge..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-surface-300/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Trader</th>
                <th className="py-3 px-4">Badge / Title</th>
                <th className="py-3 px-4">Top Holding</th>
                <th className="py-3 px-4">Total Yield</th>
                <th className="py-3 px-4">Return %</th>
                <th className="py-3 px-4 text-right">Portfolio Value</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((u) => {
                const isCurrentUser = user && u.userId === user.uid;
                return (
                  <tr
                    key={u.userId}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-emerald-500/10 border-l-4 border-l-emerald-500 hover:bg-emerald-500/20'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-extrabold text-sm">
                      {u.rank <= 3 ? (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">#{u.rank}</span>
                      ) : (
                        <span className="text-slate-400">#{u.rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.displayName}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-700 bg-surface-200"
                        />
                        <div>
                          <span className={`font-bold block ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
                            {u.displayName}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-0.5">
                              <UserCheck className="w-3 h-3" /> Logged In User
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-100 border border-slate-700 text-slate-200 text-[11px] font-mono">
                        {u.badge}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">{u.topHolding}</td>

                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {u.totalProfit >= 0 ? '+' : ''}
                      {formatCurrency(u.totalProfit, 'INR')}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          u.returnPercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {u.returnPercent >= 0 ? '+' : ''}
                        {u.returnPercent}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white">
                      {formatCurrency(u.portfolioValue, 'INR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
