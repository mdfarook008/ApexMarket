import React from 'react';
import { Link } from 'react-router-dom';
import { useMarket } from '../contexts/MarketContext';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart2,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { topGainers } = useMarket();

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Ticker Ribbon Bar */}
      <div className="bg-surface-300/80 border-b border-slate-800/80 overflow-x-auto whitespace-nowrap py-2 px-4 scrollbar-none font-mono text-xs">
        <div className="inline-flex items-center gap-6 animate-pulse">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" /> LIVE MARKET FEED:
          </span>
          {topGainers.map((asset) => (
            <div key={asset.symbol} className="inline-flex items-center gap-2">
              <span className="text-white font-semibold">{asset.symbol}</span>
              <span className="text-slate-200">{formatCurrency(asset.price, asset.currency)}</span>
              <span className="text-emerald-400 font-bold">+{asset.changePercent24h.toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Zero Risk • Virtual Funds • Real-Time Market Simulation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Master Stock & Crypto Trading with <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            ₹1,00,000 Virtual Capital
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
          ApexMarket provides a high-density paper trading engine equipped with interactive TradingView-style charts, real-time tick updates, portfolio analytics, and competitive global leaderboards.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>Create Real Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface-200 border border-slate-700 text-white font-bold text-sm hover:bg-surface-100 transition-colors"
          >
            Create Free Account
          </Link>
        </div>

        {/* Mockup Preview Card */}
        <div className="pt-10 max-w-5xl mx-auto">
          <div className="bg-[#121824] border border-slate-700/80 rounded-3xl p-4 shadow-2xl shadow-emerald-500/10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 px-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 font-mono ml-2">apexmarket.io/dashboard</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold">₹1,00,000 AVAILABLE</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="bg-surface-200/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Portfolio</span>
                <span className="text-xl font-bold font-mono text-white">₹1,08,420.00</span>
                <span className="text-xs text-emerald-400 font-mono font-semibold block mt-1">+8.42% Total Return</span>
              </div>
              <div className="bg-surface-200/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Holdings</span>
                <span className="text-xl font-bold font-mono text-emerald-400">4 Assets</span>
                <span className="text-xs text-slate-300 font-mono block mt-1">RELIANCE, BTC, TCS, SOL</span>
              </div>
              <div className="bg-surface-200/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono uppercase block">Trading Rank</span>
                <span className="text-xl font-bold font-mono text-amber-400">#1 Champion</span>
                <span className="text-xs text-slate-300 font-mono block mt-1">👑 Diamond Hands Badge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-4 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Engineered for High Performance Paper Trading</h2>
          <p className="text-xs sm:text-sm text-slate-400">All the tools of professional trading platforms with zero monetary risk.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#121824] border border-slate-700/70 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Real-Time Tick Feed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant synthetic WebSocket-style tick updates with visual green/red price flash indicators.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-700/70 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Interactive Recharts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-timeframe candlestick & line charts (1D, 1W, 1M, 1Y, ALL) for technical analysis.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-700/70 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Virtual Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Execute Market & Limit BUY/SELL paper orders with instant P&L updating & position sizing.
            </p>
          </div>

          <div className="bg-[#121824] border border-slate-700/70 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Leaderboards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compete against other paper traders on portfolio yield, return percentage, and win rate.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-4 text-center text-xs text-slate-400 font-mono space-y-2">
        <div className="flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white font-sans">ApexMarket Platform</span>
        </div>
        <p>Paper Trading Simulator for Education & Portfolio Demonstration. No real money involved.</p>
        <p className="text-[10px] text-slate-400">© 2026 ApexMarket. All rights reserved.</p>
      </footer>
    </div>
  );
};
