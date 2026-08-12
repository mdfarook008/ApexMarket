import React from 'react';
import { Asset } from '../types';
import { formatCurrency } from '../utils/formatters';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../contexts/MarketContext';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const navigate = useNavigate();
  const { ticksMap, toggleWatchlist, isWatchlisted } = useMarket();

  const isPositive = asset.changePercent24h >= 0;
  const tickDirection = ticksMap[asset.symbol];
  const watchlisted = isWatchlisted(asset.symbol);

  // Sparkline data array for Recharts
  const sparklineData = asset.sparkline.map((val, idx) => ({ i: idx, v: val }));

  return (
    <div
      onClick={() => navigate(`/market/${asset.symbol}`)}
      className={`group relative bg-[#121824] border border-slate-700/60 hover:border-emerald-500/60 rounded-2xl p-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/5 cursor-pointer ${
        tickDirection === 'up'
          ? 'animate-tick-up ring-1 ring-emerald-500/50'
          : tickDirection === 'down'
          ? 'animate-tick-down ring-1 ring-rose-500/50'
          : ''
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition-colors">
              {asset.symbol}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-surface-100 text-slate-400 text-[10px] font-mono font-medium uppercase">
              {asset.type}
            </span>
          </div>
          <span className="block text-[11px] text-slate-400 truncate max-w-[140px]">{asset.name}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(asset.symbol);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            watchlisted ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300 bg-surface-200'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${watchlisted ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Center Price & Sparkline */}
      <div className="grid grid-cols-2 items-center gap-2 my-2">
        <div>
          <span className="font-mono font-bold text-base text-white block">
            {formatCurrency(asset.price, asset.currency)}
          </span>

          <div
            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold mt-1 ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>
              {isPositive ? '+' : ''}
              {asset.changePercent24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Mini Recharts Line */}
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Category Tag */}
      <div className="border-t border-slate-800/80 pt-2.5 mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>{asset.category}</span>
        <span className="group-hover:text-emerald-400 transition-colors font-sans font-semibold flex items-center gap-0.5">
          Trade <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
