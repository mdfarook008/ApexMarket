import React, { useState } from 'react';
import { Asset } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/formatters';
import { ArrowUpRight, ArrowDownRight, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface TradingPanelProps {
  asset: Asset;
  onOrderComplete?: () => void;
}

export const TradingPanel: React.FC<TradingPanelProps> = ({ asset, onOrderComplete }) => {
  const { wallet, holdings, executeBuyOrder, executeSellOrder } = useAuth();
  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [executionType, setExecutionType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [limitPrice, setLimitPrice] = useState<number>(asset.price);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const existingHolding = holdings.find((h) => h.assetSymbol === asset.symbol);
  const userOwnedQty = existingHolding ? existingHolding.quantity : 0;

  const currentExecutionPrice = executionType === 'LIMIT' ? limitPrice : asset.price;
  const numQty = typeof quantity === 'number' && !isNaN(quantity) ? quantity : 0;
  const totalCost = numQty * currentExecutionPrice;

  // Wallet Allocation Percent shortcuts
  const handleQuickAllocation = (percent: number) => {
    if (orderType === 'BUY') {
      const maxSpendable = wallet.cashBalance * (percent / 100);
      const maxUnits = Math.max(0, Math.floor((maxSpendable / currentExecutionPrice) * 1000) / 1000);
      setQuantity(maxUnits > 0 ? maxUnits : 1);
    } else {
      const maxUnits = Math.max(0, Math.floor((userOwnedQty * (percent / 100)) * 1000) / 1000);
      setQuantity(maxUnits);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (numQty <= 0) {
      setFeedback({ success: false, message: 'Quantity must be greater than 0.' });
      return;
    }

    setIsSubmitting(true);
    const result =
      orderType === 'BUY'
        ? await executeBuyOrder(asset, numQty)
        : await executeSellOrder(asset, numQty);
    setIsSubmitting(false);

    setFeedback(result);
    if (result.success && onOrderComplete) {
      onOrderComplete();
    }
  };

  return (
    <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header & Order Type Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Trade Execution</span>
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            {asset.symbol} <span className="text-slate-400 font-normal text-xs">({asset.name})</span>
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-surface-300 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setOrderType('BUY');
              setFeedback(null);
            }}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
              orderType === 'BUY'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => {
              setOrderType('SELL');
              setFeedback(null);
            }}
            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-all ${
              orderType === 'SELL'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SELL
          </button>
        </div>
      </div>

      <form onSubmit={handleOrderSubmit} className="space-y-4 font-sans">
        {/* Execution Type Selector */}
        <div className="flex items-center justify-between bg-surface-200/60 p-1 rounded-xl text-xs border border-slate-800">
          <button
            type="button"
            onClick={() => setExecutionType('MARKET')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              executionType === 'MARKET' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Market Order
          </button>
          <button
            type="button"
            onClick={() => setExecutionType('LIMIT')}
            className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
              executionType === 'LIMIT' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Limit Order
          </button>
        </div>

        {/* Limit Price Input if Limit Order */}
        {executionType === 'LIMIT' && (
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400 uppercase">Limit Price ({asset.currency})</label>
            <input
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-surface-300 border border-slate-700 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Quantity Input */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Order Quantity</span>
            <span>
              {orderType === 'BUY'
                ? `Avail Cash: ${formatCurrency(wallet.cashBalance, 'INR')}`
                : `Owned: ${userOwnedQty} ${asset.symbol}`}
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              step="any"
              min="0.0001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
            />
            <span className="absolute right-3 font-mono font-semibold text-xs text-slate-400">
              {asset.symbol}
            </span>
          </div>
        </div>

        {/* Quick Percentage Shortcuts */}
        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handleQuickAllocation(pct)}
              className="py-1 rounded-lg bg-surface-200 border border-slate-800 text-[10px] font-mono text-slate-300 hover:border-emerald-500/60 hover:text-emerald-400 transition-colors"
            >
              {pct === 100 ? 'MAX' : `${pct}%`}
            </button>
          ))}
        </div>

        {/* Cost Summary Breakdown */}
        <div className="bg-surface-200/80 rounded-xl p-3 space-y-1.5 text-xs border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>Price / Unit</span>
            <span className="text-slate-200">{formatCurrency(currentExecutionPrice, asset.currency)}</span>
          </div>

          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>Brokerage Fee</span>
            <span className="text-emerald-400 font-bold">₹0.00 (Zero Fee Paper Trade)</span>
          </div>

          <div className="border-t border-slate-800 pt-1.5 flex items-center justify-between font-mono font-bold text-sm">
            <span className="text-slate-200">Total Order Value</span>
            <span className={orderType === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
              {formatCurrency(totalCost, 'INR')}
            </span>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.success
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}
          >
            {feedback.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="leading-snug">{feedback.message}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-xl transition-all duration-200 flex items-center justify-center gap-2 ${
            orderType === 'BUY'
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 text-white shadow-rose-500/25 hover:shadow-rose-500/40'
          }`}
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{isSubmitting ? 'Executing...' : `Execute ${orderType} Order`}</span>
          {orderType === 'BUY' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
