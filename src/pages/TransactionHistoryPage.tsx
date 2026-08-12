import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { History, Search, ArrowUpRight, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const TransactionHistoryPage: React.FC = () => {
  const { transactions } = useAuth();
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((tx) => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesSearch =
      tx.assetSymbol.toLowerCase().includes(search.toLowerCase()) ||
      tx.assetName.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#121824] via-surface-200 to-[#121824] border border-slate-700/70 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-mono font-semibold">
              Execution Records
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Transaction History</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit log of all executed market and limit paper trading orders.
          </p>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Order Type Tabs */}
          <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {(['ALL', 'BUY', 'SELL'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                  filterType === t ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All Orders' : `${t} Orders`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search symbol or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-200 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-surface-300/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Order Type</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Fill Price</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const isBuy = tx.type === 'BUY';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {tx.id}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        {formatDate(tx.timestamp)}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="block">{tx.assetSymbol}</span>
                        <span className="text-[11px] text-slate-400 font-normal block">{tx.assetName}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                            isBuy
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isBuy ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          <span>{tx.type} ({tx.orderType})</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-200">
                        {tx.quantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {formatCurrency(tx.price, 'INR')}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {formatCurrency(tx.totalAmount, 'INR')}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{tx.status}</span>
                        </span>
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
