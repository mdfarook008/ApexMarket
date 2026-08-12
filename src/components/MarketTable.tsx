import React, { useState } from 'react';
import { Asset } from '../types';
import { useMarket } from '../contexts/MarketContext';
import { formatCurrency, formatCompactNumber } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Star, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketTableProps {
  assetsList?: Asset[];
}

export const MarketTable: React.FC<MarketTableProps> = ({ assetsList }) => {
  const {
    filteredAssets,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    toggleWatchlist,
    isWatchlisted,
    ticksMap
  } = useMarket();

  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Asset>('marketCap');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const displayAssets = assetsList || filteredAssets;

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedAssets = [...displayAssets].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? (valA as string).localeCompare(valB as string)
        : (valB as string).localeCompare(valA as string);
    }
    return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const categories = ['All', 'Stocks', 'Crypto', 'Top Gainers', 'Top Losers', 'Watchlist'];

  return (
    <div className="bg-[#121824] border border-slate-700/70 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl overflow-x-auto scrollbar-none border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search symbol or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 rounded-xl bg-surface-200 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-surface-300/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Asset</th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                <div className="flex items-center gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('changePercent24h')}>
                <div className="flex items-center gap-1">
                  <span>24h Change</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 hidden md:table-cell">24h High / Low</th>
              <th className="py-3 px-4 hidden lg:table-cell cursor-pointer hover:text-white" onClick={() => handleSort('volume24h')}>
                <div className="flex items-center gap-1">
                  <span>24h Volume</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 hidden lg:table-cell cursor-pointer hover:text-white" onClick={() => handleSort('marketCap')}>
                <div className="flex items-center gap-1">
                  <span>Market Cap</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-sans">
            {sortedAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                  No assets found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedAssets.map((asset) => {
                const isPos = asset.changePercent24h >= 0;
                const tickDir = ticksMap[asset.symbol];
                const watchlisted = isWatchlisted(asset.symbol);

                return (
                  <tr
                    key={asset.symbol}
                    onClick={() => navigate(`/market/${asset.symbol}`)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      tickDir === 'up'
                        ? 'bg-emerald-500/10'
                        : tickDir === 'down'
                        ? 'bg-rose-500/10'
                        : ''
                    }`}
                  >
                    {/* Asset Name & Symbol */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWatchlist(asset.symbol);
                          }}
                          className={`p-1 rounded transition-colors ${
                            watchlisted ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${watchlisted ? 'fill-amber-400' : ''}`} />
                        </button>
                        <div>
                          <span className="font-bold text-white block hover:text-emerald-400 transition-colors">
                            {asset.symbol}
                          </span>
                          <span className="text-[11px] text-slate-400 block truncate max-w-[150px]">
                            {asset.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-semibold text-white">
                      {formatCurrency(asset.price, asset.currency)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3 px-4 font-mono">
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                          isPos
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>
                          {isPos ? '+' : ''}
                          {asset.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    {/* High / Low */}
                    <td className="py-3 px-4 hidden md:table-cell font-mono text-slate-400 text-[11px]">
                      <div>H: {formatCurrency(asset.high24h, asset.currency)}</div>
                      <div className="text-slate-400">L: {formatCurrency(asset.low24h, asset.currency)}</div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-4 hidden lg:table-cell font-mono text-slate-300 text-[11px]">
                      {formatCompactNumber(asset.volume24h)}
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-4 hidden lg:table-cell font-mono text-slate-300 text-[11px]">
                      {formatCompactNumber(asset.marketCap)}
                    </td>

                    {/* Quick Trade Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/market/${asset.symbol}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[11px] hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
