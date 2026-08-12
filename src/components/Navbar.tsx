import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarket } from '../contexts/MarketContext';
import { formatCurrency } from '../utils/formatters';
import {
  TrendingUp,
  Search,
  Bell,
  Wallet,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, wallet, logout, notifications, dismissNotification, clearNotifications } = useAuth();
  const { searchQuery, setSearchQuery, assets } = useMarket();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const searchResults = searchQuery.trim()
    ? assets
        .filter(
          (a) =>
            a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0E14]/90 backdrop-blur-md border-b border-surface-50/50 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left Brand */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
              <div className="w-full h-full bg-[#0B0E14] rounded-[10px] flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent font-sans">
                ApexMarket
              </span>
              <span className="block text-[10px] text-emerald-400/90 font-mono font-semibold tracking-wider uppercase -mt-1">
                Paper Trading Platform
              </span>
            </div>
          </Link>

          {/* Quick Search */}
          <div className="relative hidden md:block w-72 lg:w-96">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search stocks, crypto, indices (e.g. RELIANCE, BTC)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 bg-surface-200/80 border border-slate-700/60 rounded-xl text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Search Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-[#121824] border border-slate-700/70 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/60"
                onMouseLeave={() => setShowSearchResults(false)}
              >
                {searchResults.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => {
                      navigate(`/market/${asset.symbol}`);
                      setShowSearchResults(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-slate-800/60 transition-colors text-left"
                  >
                    <div>
                      <span className="font-semibold text-xs text-white">{asset.symbol}</span>
                      <span className="block text-[11px] text-slate-400 truncate max-w-[180px]">{asset.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-medium text-xs text-slate-100">
                        {formatCurrency(asset.price, asset.currency)}
                      </span>
                      <span
                        className={`block text-[10px] font-mono font-semibold ${
                          asset.changePercent24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {asset.changePercent24h >= 0 ? '+' : ''}
                        {asset.changePercent24h.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center gap-3">
          {/* Virtual Wallet Badge */}
          <div className="hidden sm:flex items-center gap-3 bg-surface-200/90 border border-slate-700/70 rounded-xl px-3.5 py-1.5 shadow-inner">
            <div className="flex items-center gap-2 border-r border-slate-700/80 pr-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                  Available Cash
                </span>
                <span className="font-mono font-bold text-xs text-emerald-400">
                  {formatCurrency(wallet.cashBalance, 'INR')}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                Portfolio Value
              </span>
              <span className="font-mono font-bold text-xs text-white">
                {formatCurrency(wallet.portfolioValue, 'INR')}
              </span>
            </div>

          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-surface-200 border border-slate-700/70 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#121824] border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-4 divide-y divide-slate-800/80">
                <div className="flex items-center justify-between pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-xs text-white">Notifications</h4>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="py-2 max-h-72 overflow-y-auto space-y-2 font-sans">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 relative group"
                      >
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                        {n.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <h5 className="font-semibold text-xs text-white">{n.title}</h5>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                          <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <button
                          onClick={() => dismissNotification(n.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl bg-surface-200 border border-slate-700/70 hover:border-slate-600 transition-colors"
              >
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.displayName}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-emerald-500/40"
                />
                <span className="hidden lg:inline text-xs font-semibold text-slate-200 pr-1">
                  {user.displayName}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#121824] border border-slate-700/80 rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-semibold text-xs text-white">{user.displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-medium">
                      {user.badge}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    Profile & Statistics
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
