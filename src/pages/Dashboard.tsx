import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMarket } from '../contexts/MarketContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { INITIAL_PORTFOLIO_HISTORY } from '../data/mockData';
import { PortfolioGrowthChart, AssetAllocationChart } from '../components/AnalyticsCharts';
import { AssetCard } from '../components/AssetCard';
import { MarketTable } from '../components/MarketTable';
import { TradingPanel } from '../components/TradingPanel';
import {
  Wallet,
  TrendingUp,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  Flame,
  Clock
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { wallet, holdings, transactions } = useAuth();
  const { topGainers, topLosers, trendingAssets, assets } = useMarket();

  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>('RELIANCE');
  const activeAsset = assets.find((a) => a.symbol === selectedAssetSymbol) || assets[0];

  const isProfitable = wallet.totalProfitLoss >= 0;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121824] via-surface-200 to-[#121824] border border-slate-700/70 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              Live Paper Trading Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Trading Dashboard</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time prices, manage your paper portfolio, and execute instant simulated trades.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedAssetSymbol('BTC')}
            className="px-3.5 py-2 rounded-xl bg-surface-300 border border-slate-700 text-xs font-semibold text-white hover:border-emerald-500 transition-colors"
          >
            Trade BTC
          </button>
          <button
            onClick={() => setSelectedAssetSymbol('RELIANCE')}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
          >
            Trade RELIANCE
          </button>
        </div>
      </div>

      {/* Wallet Summary 4-Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Available Cash */}
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Available Cash</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.cashBalance, 'INR')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Ready for Virtual Execution</span>
        </div>

        {/* Card 2: Invested Amount */}
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Invested Amount</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.investedAmount, 'INR')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">{holdings.length} Active Positions</span>
        </div>

        {/* Card 3: Total Profit/Loss */}
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Profit / Loss</span>
            <div
              className={`p-2 rounded-xl ${
                isProfitable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {isProfitable ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          </div>
          <div
            className={`font-mono font-extrabold text-2xl ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isProfitable ? '+' : ''}
            {formatCurrency(wallet.totalProfitLoss, 'INR')}
          </div>
          <span
            className={`text-[11px] font-mono font-semibold block ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatPercent(wallet.totalProfitLossPercent)} Return
          </span>
        </div>

        {/* Card 4: Total Portfolio Value */}
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Portfolio Value</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <PieIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.portfolioValue, 'INR')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Cash + Current Holdings Value</span>
        </div>
      </div>

      {/* Main Grid: Chart + Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Portfolio Growth & Allocation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Performance Chart */}
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Telemetry</span>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Portfolio Growth Trend
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">7D Performance</span>
            </div>

            <PortfolioGrowthChart data={INITIAL_PORTFOLIO_HISTORY} />
          </div>

          {/* Top Gainers Row */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-400" /> Top Market Gainers
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {topGainers.slice(0, 3).map((asset) => (
                <AssetCard key={asset.symbol} asset={asset} />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Trade Execution Panel */}
        <div className="space-y-6">
          <TradingPanel asset={activeAsset} />

          {/* Recent Orders Log Preview */}
          <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Recent Paper Orders
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Total: {transactions.length}</span>
            </div>

            <div className="space-y-2">
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-2 rounded-xl bg-surface-200/60 text-xs font-mono">
                  <div>
                    <span
                      className={`font-bold ${
                        tx.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tx.type} {tx.quantity} {tx.assetSymbol}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      @ {formatCurrency(tx.price, 'INR')}
                    </span>
                  </div>
                  <span className="text-slate-200 font-bold">
                    {formatCurrency(tx.totalAmount, 'INR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full Market Directory Table */}
      <MarketTable />
    </div>
  );
};
