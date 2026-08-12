import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { AssetAllocationChart, PortfolioGrowthChart } from '../components/AnalyticsCharts';
import { INITIAL_PORTFOLIO_HISTORY } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { PieChart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { wallet, holdings } = useAuth();
  const navigate = useNavigate();

  const isProfitable = wallet.totalProfitLoss >= 0;

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121824] via-surface-200 to-[#121824] border border-slate-700/70 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold">
              Paper Portfolio Simulation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">My Portfolio</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Track asset allocation, average buy prices, unrealized gains, and cash position.
          </p>
        </div>

      </div>

      {/* Metrics 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Portfolio Value</span>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.portfolioValue, 'INR')}
          </div>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Available Cash</span>
          <div className="font-mono font-extrabold text-2xl text-emerald-400">
            {formatCurrency(wallet.cashBalance, 'INR')}
          </div>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Invested Capital</span>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.investedAmount, 'INR')}
          </div>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Total Return (P&L)</span>
          <div
            className={`font-mono font-extrabold text-2xl ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isProfitable ? '+' : ''}
            {formatCurrency(wallet.totalProfitLoss, 'INR')}
          </div>
          <span className={`text-[11px] font-mono font-semibold block ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercent(wallet.totalProfitLossPercent)}
          </span>
        </div>
      </div>

      {/* Asset Allocation & Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieChart className="w-4 h-4 text-emerald-400" /> Asset Allocation Pie Chart
          </h3>
          <AssetAllocationChart holdings={holdings} cashBalance={wallet.cashBalance} />
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="w-4 h-4 text-emerald-400" /> Portfolio Equity Curve
          </h3>
          <PortfolioGrowthChart data={INITIAL_PORTFOLIO_HISTORY} />
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-white">Active Positions ({holdings.length})</h3>
          <span className="text-xs font-mono text-slate-400">Real-time Valuation</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-surface-300/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Avg Buy Price</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">Total Value</th>
                <th className="py-3 px-4">Unrealized P&L</th>
                <th className="py-3 px-4 text-right">Trade Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    You currently have no active holdings. Go to the Market page to open paper positions!
                  </td>
                </tr>
              ) : (
                holdings.map((h) => {
                  const pnlPos = h.unrealizedPnL >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="block hover:text-emerald-400 cursor-pointer" onClick={() => navigate(`/market/${h.assetSymbol}`)}>
                          {h.assetSymbol}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal block">{h.assetName}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-surface-100 border border-slate-700 text-slate-300 font-mono text-[10px] uppercase">
                          {h.assetType}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {h.quantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {formatCurrency(h.avgBuyPrice, 'INR')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-white font-semibold">
                        {formatCurrency(h.currentPrice, 'INR')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {formatCurrency(h.currentValue, 'INR')}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                            pnlPos
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {pnlPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>
                            {pnlPos ? '+' : ''}
                            {formatCurrency(h.unrealizedPnL, 'INR')} ({h.unrealizedPnLPercent.toFixed(2)}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate(`/market/${h.assetSymbol}`)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-[11px] hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Trade / Sell
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
    </div>
  );
};
