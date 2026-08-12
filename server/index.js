import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database Store for full-stack operation
const usersDb = new Map(); // uid -> user profile
const walletsDb = new Map(); // uid -> wallet
const holdingsDb = new Map(); // uid -> holdings[]
const transactionsDb = new Map(); // uid -> transactions[]

// Seed Demo User
const DEMO_UID = 'demo-trader-01';
usersDb.set(DEMO_UID, {
  uid: DEMO_UID,
  email: 'trader@apexmarket.io',
  displayName: 'Alpha Quant',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  createdAt: new Date().toISOString(),
  winRate: 68.4,
  totalTrades: 24,
  bestTrade: 14250.00,
  worstTrade: -3200.00,
  badge: '👑 Diamond Hands'
});

walletsDb.set(DEMO_UID, {
  cashBalance: 57438.00,
  investedAmount: 44637.00,
  portfolioValue: 108420.00,
  totalProfitLoss: 8420.00,
  totalProfitLossPercent: 8.42
});

holdingsDb.set(DEMO_UID, [
  {
    id: 'h-1',
    assetSymbol: 'RELIANCE',
    assetName: 'Reliance Industries Ltd.',
    assetType: 'stock',
    quantity: 7,
    avgBuyPrice: 2938.20,
    totalInvestment: 20567.40,
    currentPrice: 2980.50,
    currentValue: 20863.50,
    unrealizedPnL: 296.10,
    unrealizedPnLPercent: 1.44
  },
  {
    id: 'h-2',
    assetSymbol: 'BTC',
    assetName: 'Bitcoin',
    assetType: 'crypto',
    quantity: 0.05,
    avgBuyPrice: 60100.00,
    totalInvestment: 3005.00,
    currentPrice: 62450.00,
    currentValue: 3122.50,
    unrealizedPnL: 117.50,
    unrealizedPnLPercent: 3.91
  }
]);

transactionsDb.set(DEMO_UID, [
  {
    id: 'tx-101',
    userId: DEMO_UID,
    assetSymbol: 'RELIANCE',
    assetName: 'Reliance Industries Ltd.',
    type: 'BUY',
    orderType: 'MARKET',
    quantity: 7,
    price: 2938.20,
    totalAmount: 20567.40,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'COMPLETED'
  }
]);

// --- API ENDPOINTS ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', server: 'ApexMarket Node Server Active', timestamp: new Date().toISOString() });
});

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
  const { displayName, email, password } = req.body;

  if (!email || !password || !displayName) {
    return res.status(400).json({ success: false, message: 'Display Name, Email, and Password are required.' });
  }

  // Check existing
  for (const user of usersDb.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists. Please Sign In.' });
    }
  }

  const uid = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const newUser = {
    uid,
    email,
    displayName,
    photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
    createdAt: new Date().toISOString(),
    winRate: 100.0,
    totalTrades: 0,
    bestTrade: 0,
    worstTrade: 0,
    badge: '🌱 Novice Trader'
  };

  const newWallet = {
    cashBalance: 100000.00,
    investedAmount: 0.00,
    portfolioValue: 100000.00,
    totalProfitLoss: 0.00,
    totalProfitLossPercent: 0.00
  };

  usersDb.set(uid, newUser);
  walletsDb.set(uid, newWallet);
  holdingsDb.set(uid, []);
  transactionsDb.set(uid, []);

  res.json({
    success: true,
    message: 'Registration successful! ₹1,00,000 virtual cash credited.',
    user: newUser,
    wallet: newWallet,
    holdings: [],
    transactions: []
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  let foundUser = null;
  for (const u of usersDb.values()) {
    if (u.email.toLowerCase() === email.toLowerCase()) {
      foundUser = u;
      break;
    }
  }

  if (!foundUser) {
    // Auto-create account if not found for easy demo testing
    const uid = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const displayName = email.split('@')[0].replace('.', ' ');
    foundUser = {
      uid,
      email,
      displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
      createdAt: new Date().toISOString(),
      winRate: 100.0,
      totalTrades: 0,
      bestTrade: 0,
      worstTrade: 0,
      badge: '⚡ Quant Trader'
    };

    const newWallet = {
      cashBalance: 100000.00,
      investedAmount: 0.00,
      portfolioValue: 100000.00,
      totalProfitLoss: 0.00,
      totalProfitLossPercent: 0.00
    };

    usersDb.set(uid, foundUser);
    walletsDb.set(uid, newWallet);
    holdingsDb.set(uid, []);
    transactionsDb.set(uid, []);
  }

  const uid = foundUser.uid;
  res.json({
    success: true,
    message: 'Signed in successfully!',
    user: foundUser,
    wallet: walletsDb.get(uid),
    holdings: holdingsDb.get(uid) || [],
    transactions: transactionsDb.get(uid) || []
  });
});

// GET /api/user/:userId
app.get('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = usersDb.get(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({
    success: true,
    user,
    wallet: walletsDb.get(userId),
    holdings: holdingsDb.get(userId) || [],
    transactions: transactionsDb.get(userId) || []
  });
});

// POST /api/trades/buy
app.post('/api/trades/buy', (req, res) => {
  const { userId, asset, quantity } = req.body;
  const targetUid = userId || DEMO_UID;

  let wallet = walletsDb.get(targetUid);
  if (!wallet) {
    wallet = { cashBalance: 100000, investedAmount: 0, portfolioValue: 100000, totalProfitLoss: 0, totalProfitLossPercent: 0 };
    walletsDb.set(targetUid, wallet);
  }

  const totalCost = quantity * asset.price;
  if (wallet.cashBalance < totalCost) {
    return res.status(400).json({ success: false, message: `Insufficient cash! Required ₹${totalCost.toLocaleString('en-IN')}, Available ₹${wallet.cashBalance.toLocaleString('en-IN')}` });
  }

  wallet.cashBalance -= totalCost;

  let userHoldings = holdingsDb.get(targetUid) || [];
  const existing = userHoldings.find((h) => h.assetSymbol === asset.symbol);

  if (existing) {
    const newQty = existing.quantity + quantity;
    const newTotalInvestment = existing.totalInvestment + totalCost;
    const newAvgBuyPrice = newTotalInvestment / newQty;
    const newCurrentValue = newQty * asset.price;
    const newPnL = newCurrentValue - newTotalInvestment;
    const newPnLPercent = (newPnL / newTotalInvestment) * 100;

    userHoldings = userHoldings.map((h) =>
      h.assetSymbol === asset.symbol
        ? {
            ...h,
            quantity: newQty,
            avgBuyPrice: newAvgBuyPrice,
            totalInvestment: newTotalInvestment,
            currentPrice: asset.price,
            currentValue: newCurrentValue,
            unrealizedPnL: newPnL,
            unrealizedPnLPercent: newPnLPercent
          }
        : h
    );
  } else {
    userHoldings.push({
      id: `h-${Date.now()}`,
      assetSymbol: asset.symbol,
      assetName: asset.name,
      assetType: asset.type,
      quantity,
      avgBuyPrice: asset.price,
      totalInvestment: totalCost,
      currentPrice: asset.price,
      currentValue: totalCost,
      unrealizedPnL: 0,
      unrealizedPnLPercent: 0
    });
  }

  holdingsDb.set(targetUid, userHoldings);

  // Update total portfolio value & invested amount
  const investedAmount = userHoldings.reduce((acc, h) => acc + h.totalInvestment, 0);
  const currentHoldingsVal = userHoldings.reduce((acc, h) => acc + (h.quantity * asset.price), 0);
  wallet.investedAmount = investedAmount;
  wallet.portfolioValue = wallet.cashBalance + currentHoldingsVal;
  wallet.totalProfitLoss = wallet.portfolioValue - 100000;
  wallet.totalProfitLossPercent = (wallet.totalProfitLoss / 100000) * 100;

  // Add Transaction
  const newTx = {
    id: `tx-${Date.now()}`,
    userId: targetUid,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    type: 'BUY',
    orderType: 'MARKET',
    quantity,
    price: asset.price,
    totalAmount: totalCost,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED'
  };

  const userTxs = transactionsDb.get(targetUid) || [];
  userTxs.unshift(newTx);
  transactionsDb.set(targetUid, userTxs);

  res.json({
    success: true,
    message: `Bought ${quantity} ${asset.symbol} @ ₹${asset.price.toLocaleString('en-IN')}`,
    wallet,
    holdings: userHoldings,
    transactions: userTxs
  });
});

// POST /api/trades/sell
app.post('/api/trades/sell', (req, res) => {
  const { userId, asset, quantity } = req.body;
  const targetUid = userId || DEMO_UID;

  let wallet = walletsDb.get(targetUid);
  let userHoldings = holdingsDb.get(targetUid) || [];

  const existing = userHoldings.find((h) => h.assetSymbol === asset.symbol);
  if (!existing || existing.quantity < quantity) {
    return res.status(400).json({ success: false, message: `Insufficient holdings to sell. You own ${existing ? existing.quantity : 0} ${asset.symbol}` });
  }

  const totalRevenue = quantity * asset.price;
  wallet.cashBalance += totalRevenue;

  userHoldings = userHoldings
    .map((h) => {
      if (h.assetSymbol === asset.symbol) {
        const newQty = h.quantity - quantity;
        if (newQty <= 0) return null;
        const newTotalInvestment = newQty * h.avgBuyPrice;
        const newCurrentValue = newQty * asset.price;
        const newPnL = newCurrentValue - newTotalInvestment;
        const newPnLPercent = (newPnL / newTotalInvestment) * 100;
        return {
          ...h,
          quantity: newQty,
          totalInvestment: newTotalInvestment,
          currentPrice: asset.price,
          currentValue: newCurrentValue,
          unrealizedPnL: newPnL,
          unrealizedPnLPercent: newPnLPercent
        };
      }
      return h;
    })
    .filter(Boolean);

  holdingsDb.set(targetUid, userHoldings);

  const investedAmount = userHoldings.reduce((acc, h) => acc + h.totalInvestment, 0);
  const currentHoldingsVal = userHoldings.reduce((acc, h) => acc + (h.quantity * asset.price), 0);
  wallet.investedAmount = investedAmount;
  wallet.portfolioValue = wallet.cashBalance + currentHoldingsVal;
  wallet.totalProfitLoss = wallet.portfolioValue - 100000;
  wallet.totalProfitLossPercent = (wallet.totalProfitLoss / 100000) * 100;

  const newTx = {
    id: `tx-${Date.now()}`,
    userId: targetUid,
    assetSymbol: asset.symbol,
    assetName: asset.name,
    type: 'SELL',
    orderType: 'MARKET',
    quantity,
    price: asset.price,
    totalAmount: totalRevenue,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED'
  };

  const userTxs = transactionsDb.get(targetUid) || [];
  userTxs.unshift(newTx);
  transactionsDb.set(targetUid, userTxs);

  res.json({
    success: true,
    message: `Sold ${quantity} ${asset.symbol} @ ₹${asset.price.toLocaleString('en-IN')}`,
    wallet,
    holdings: userHoldings,
    transactions: userTxs
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ApexMarket Multi-User Backend Server listening on http://localhost:${PORT}`);
});
