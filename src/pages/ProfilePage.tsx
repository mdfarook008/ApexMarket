import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  User,
  Shield,
  Award,
  LogOut,
  Edit3,
  Camera,
  MapPin,
  Sparkles,
  Check,
  X,
  Upload,
  BookOpen,
  Briefcase
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Trader1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=QuantPro'
];

export const ProfilePage: React.FC = () => {
  const { user, wallet, holdings, transactions, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [bio, setBio] = useState(user?.bio || 'Quantitative paper trader developing momentum strategies in equities & crypto.');
  const [location, setLocation] = useState(user?.location || 'Mumbai, India');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [badge, setBadge] = useState(user?.badge || '⚡ Quant Trader');
  const [favoriteAsset, setFavoriteAsset] = useState(user?.favoriteAsset || 'Stocks & Crypto');

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.displayName || '');
    setPhotoURL(user.photoURL || '');
    setBio(user.bio || '');
    setLocation(user.location || '');
    setExperienceLevel(user.experienceLevel || 'Beginner');
    setBadge(user.badge || '🌱 Novice Trader');
    setFavoriteAsset(user.favoriteAsset || '');
  }, [user]);

  if (!user) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>No active user logged in.</p>
      </div>
    );
  }

  const isProfitable = wallet.totalProfitLoss >= 0;

  // File upload reader for custom avatar DP
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoURL(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    console.log("Saving photo:", photoURL);
    await updateUserProfile({
      displayName: displayName.trim(),
      photoURL: photoURL.trim(),
      bio: bio.trim(),
      location: location.trim(),
      experienceLevel,
      badge,
      favoriteAsset: favoriteAsset.trim()
    });
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 font-sans pb-12 max-w-5xl mx-auto">
      {/* Top Banner Profile Card */}
      <div className="bg-[#121824] border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative group">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.displayName)}`}
                alt={user.displayName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/40 shadow-xl shadow-emerald-500/20 bg-surface-200"
              />
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
                title="Edit Display Picture"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user.displayName}</h1>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                  {user.badge}
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono">{user.email}</p>

              {user.location && (
                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-slate-300 font-mono pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{user.location}</span>
                  <span className="text-slate-500">|</span>
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{user.experienceLevel}</span>
                </div>
              )}

              {/* Bio Box */}
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl pt-2 italic">
                "{user.bio || 'Quantitative paper trader practicing risk management and momentum strategies.'}"
              </p>
            </div>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile & DP</span>
            </button>
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#121824] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-lg text-white">Edit Profile & Display Picture</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 font-sans">
              {/* DP Selection */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-300 font-semibold uppercase block">
                  Profile Photo (DP)
                </label>

                {/* Preview + File Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Trader1'}
                    alt="Preview DP"
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-emerald-500/50 bg-surface-200 shrink-0"
                  />

                  <div className="flex-1 space-y-2 w-full">
                    <label className="w-full py-2.5 px-4 rounded-xl bg-surface-200 border border-slate-700 text-xs font-semibold text-white hover:bg-surface-100 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>Upload Custom Photo from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Preset Avatar Gallery */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">Or Choose Preset Avatar</span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoURL(avatar)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          photoURL === avatar ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/30' : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <img src={avatar} alt={`Avatar ${idx}`} className="w-full h-full object-cover bg-surface-200" />
                        {photoURL === avatar && (
                          <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white font-bold" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Location / City</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Trading Title Badge</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="👑 Diamond Hands">👑 Diamond Hands</option>
                    <option value="⚡ Quant Trader">⚡ Quant Trader</option>
                    <option value="🚀 Bullish Scalper">🚀 Bullish Scalper</option>
                    <option value="🛡️ Value HODLer">🛡️ Value HODLer</option>
                    <option value="🧠 Algo Analyst">🧠 Algo Analyst</option>
                    <option value="🌱 Novice Trader">🌱 Novice Trader</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Novice">Novice Trader</option>
                    <option value="Intermediate">Intermediate Trader</option>
                    <option value="Pro Quant">Pro Quant Analyst</option>
                    <option value="Algo Specialist">Algo Specialist</option>
                  </select>
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Profile Bio</span>
                  <span>{bio.length}/200 characters</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the ApexMarket community about your trading style, strategies, or goals..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-300 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-surface-200 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile & DP'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Breakdown Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Portfolio Net Value</span>
          <div className="font-mono font-extrabold text-2xl text-white">
            {formatCurrency(wallet.portfolioValue, 'INR')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Cash + Current Holdings Value</span>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Available Cash</span>
          <div className="font-mono font-extrabold text-2xl text-emerald-400">
            {formatCurrency(wallet.cashBalance, 'INR')}
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Available Virtual Capital</span>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Active Positions</span>
          <div className="font-mono font-extrabold text-2xl text-white">
            {holdings.length} Assets
          </div>
          <span className="text-[10px] text-slate-400 font-mono block">Invested: {formatCurrency(wallet.investedAmount, 'INR')}</span>
        </div>

        <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Total Yield / P&L</span>
          <div className={`font-mono font-extrabold text-2xl ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfitable ? '+' : ''}{formatCurrency(wallet.totalProfitLoss, 'INR')}
          </div>
          <span className={`text-[11px] font-mono font-semibold block ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatPercent(wallet.totalProfitLossPercent)} Return
          </span>
        </div>
      </div>

      {/* Performance & Telemetry */}
      <div className="bg-[#121824] border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Award className="w-4 h-4 text-emerald-400" /> Account Trading Telemetry
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="bg-surface-200/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] uppercase block">Win Rate Ratio</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{user.winRate}%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Profitable Executions</span>
          </div>

          <div className="bg-surface-200/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] uppercase block">Executed Orders</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{transactions.length}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">BUY & SELL Orders Logged</span>
          </div>

          <div className="bg-surface-200/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] uppercase block">Best Trade High</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
              +{formatCurrency(user.bestTrade, 'INR')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Single Execution High</span>
          </div>

          <div className="bg-surface-200/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[11px] uppercase block">Max Drawdown</span>
            <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
              {formatCurrency(user.worstTrade, 'INR')}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Single Execution Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
