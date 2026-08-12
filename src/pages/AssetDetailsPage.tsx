import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../contexts/MarketContext';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { generatePriceHistory } from '../data/mockData';
import { TradingPanel } from '../components/TradingPanel';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, Star, ArrowUpRight, ArrowDownRight, Activity, BarChart2 } from 'lucide-react';

export const AssetDetailsPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { getAssetBySymbol, toggleWatchlist, isWatchlisted, ticksMap } = useMarket();

  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '1Y' | 'ALL'>('1D');

  const asset = getAssetBySymbol(symbol || 'RELIANCE');

  const priceHistory = useMemo(() => {
    if (!asset) return [];
    return generatePriceHistory(asset.price, timeframe);
  }, [asset?.price, timeframe]);

  if (!asset) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Asset Not Found</h2>
        <button
          onClick={() => navigate('/market')}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-xs"
        >
          Return to Market Directory
        </button>
      </div>
    );
  }

  const isPos = asset.changePercent24h >= 0;
  const watchlisted = isWatchlisted(asset.symbol);
  const tickDir = ticksMap[asset.symbol];

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/market')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Market Directory</span>
      </button>

      {/* Asset Header Banner */}
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white">{asset.symbol}</h1>
            <span className="px-2.5 py-0.5 rounded-md bg-surface-100 border border-slate-700 text-slate-300 text-xs font-mono font-medium uppercase">
              {asset.type}
            </span>
            <button
              onClick={() => toggleWatchlist(asset.symbol)}
              className={`p-2 rounded-xl border transition-colors ${
                watchlisted
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-surface-200 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Star className={`w-4 h-4 ${watchlisted ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400">{asset.name} • {asset.category}</p>
        </div>

        {/* Live Price & Metrics */}
        <div
          className={`text-right p-4 rounded-xl transition-all ${
            tickDir === 'up'
              ? 'bg-emerald-500/10 ring-1 ring-emerald-500/50'
              : tickDir === 'down'
              ? 'bg-rose-500/10 ring-1 ring-rose-500/50'
              : 'bg-surface-200/50 border border-slate-800'
          }`}
        >
          <span className="font-mono font-extrabold text-3xl text-white block">
            {formatCurrency(asset.price, asset.currency)}
          </span>
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold mt-1 ${
              isPos
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPos ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span>
              {isPos ? '+' : ''}
              {asset.change24h.toFixed(2)} ({asset.changePercent24h.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Recharts + Trading Execution Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Timeframe Chart + Key Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Price History & Technical Chart</h3>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {(['1D', '1W', '1M', '1Y', 'ALL'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      timeframe === tf
                        ? 'bg-emerald-500 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Container */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPos ? '#10B981' : '#EF4444'} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={isPos ? '#10B981' : '#EF4444'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748B"
                    fontSize={11}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(v) => formatCurrency(v, asset.currency)}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#121824', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: any) => [formatCurrency(Number(val), asset.currency), 'Price']}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke={isPos ? '#10B981' : '#EF4444'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#assetGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Asset Statistics 4-Grid */}
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Key Trading Metrics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs pt-2">
              <div className="bg-surface-200/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">24h High</span>
                <span className="font-bold text-white mt-1 block">
                  {formatCurrency(asset.high24h, asset.currency)}
                </span>
              </div>

              <div className="bg-surface-200/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">24h Low</span>
                <span className="font-bold text-white mt-1 block">
                  {formatCurrency(asset.low24h, asset.currency)}
                </span>
              </div>

              <div className="bg-surface-200/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">24h Volume</span>
                <span className="font-bold text-white mt-1 block">
                  {formatCompactNumber(asset.volume24h)}
                </span>
              </div>

              <div className="bg-surface-200/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase block">Market Capitalization</span>
                <span className="font-bold text-white mt-1 block">
                  {formatCompactNumber(asset.marketCap)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Trading Order Execution Box */}
        <div>
          <TradingPanel asset={asset} />
        </div>
      </div>
    </div>
  );
};
