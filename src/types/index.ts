export type AssetType = 'stock' | 'crypto';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  category: string;
  sparkline: number[];
  currency: 'INR' | 'USD';
  description?: string;
}

export interface PricePoint {
  timestamp: string;
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface Holding {
  id: string;
  assetSymbol: string;
  assetName: string;
  assetType: AssetType;
  quantity: number;
  avgBuyPrice: number;
  totalInvestment: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

export interface Transaction {
  id: string;
  userId: string;
  assetSymbol: string;
  assetName: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface UserWallet {
  cashBalance: number;
  investedAmount: number;
  portfolioValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  location?: string;
  experienceLevel?: string;
  favoriteAsset?: string;
  createdAt: string;
  winRate: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
  badge: string;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  displayName: string;
  avatar: string;
  portfolioValue: number;
  totalProfit: number;
  returnPercent: number;
  topHolding: string;
  badge: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface PortfolioHistoryPoint {
  date: string;
  portfolioValue: number;
  cashBalance: number;
  investedAmount: number;
  pnL: number;
}
