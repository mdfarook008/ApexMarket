import React, { useState } from 'react';
import { useMarket } from '../contexts/MarketContext';
import { MarketTable } from '../components/MarketTable';
import { AssetCard } from '../components/AssetCard';
import { LayoutGrid, Table, BarChart3, TrendingUp } from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { filteredAssets, assets } = useMarket();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const stocksCount = assets.filter((a) => a.type === 'stock').length;
  const cryptoCount = assets.filter((a) => a.type === 'crypto').length;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#121824] via-surface-200 to-[#121824] border border-slate-700/70 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono font-semibold">
              Live Assets Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Market Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore 50+ equities and 30+ digital assets with live real-time price feeds.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400 border-r border-slate-700 pr-4">
            <div>
              Stocks: <span className="text-white font-bold">{stocksCount}</span>
            </div>
            <div>
              Cryptos: <span className="text-white font-bold">{cryptoCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'table' ? (
        <MarketTable />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.symbol} asset={asset} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
