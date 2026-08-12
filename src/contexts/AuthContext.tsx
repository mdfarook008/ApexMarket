import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, UserWallet, Holding, Transaction, NotificationItem, Asset } from '../types';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import {
  createUserDocument,
  getUserProfile,
  getUserWallet,
  getUserHoldings,
  getUserTransactions,
  updateUserProfileInDb,
  updateUserWallet,
  addOrUpdateHolding,
  removeHolding,
  addTransaction,
  subscribeToUserData,
  INITIAL_CASH,
  UserDataSnapshot
} from '../services/firestore';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wallet: UserWallet;
  holdings: Holding[];
  transactions: Transaction[];
  notifications: NotificationItem[];
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  registerUser: (displayName: string, email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  executeBuyOrder: (asset: Asset, quantity: number) => Promise<{ success: boolean; message: string }>;
  executeSellOrder: (asset: Asset, quantity: number) => Promise<{ success: boolean; message: string }>;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const DEFAULT_WALLET: UserWallet = {
  cashBalance: INITIAL_CASH,
  investedAmount: 0,
  portfolioValue: INITIAL_CASH,
  totalProfitLoss: 0,
  totalProfitLossPercent: 0
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wallet, setWallet] = useState<UserWallet>(DEFAULT_WALLET);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Track Firestore subscriptions
  const unsubscribersRef = useRef<Array<() => void>>([]);

  // ─── NOTIFICATION HELPERS ───
  const addNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ─── LOAD USER DATA FROM FIRESTORE ───
  const loadUserData = useCallback(async (uid: string) => {
    try {
      const [profile, walletData, holdingsData, txData] = await Promise.all([
        getUserProfile(uid),
        getUserWallet(uid),
        getUserHoldings(uid),
        getUserTransactions(uid)
      ]);

      if (profile) setUser(profile);
      setWallet(walletData);
      setHoldings(holdingsData);
      setTransactions(txData);

      return profile;
    } catch (err) {
      console.error('Error loading user data from Firestore:', err);
      return null;
    }
  }, []);

  // ─── SUBSCRIBE TO REAL-TIME FIRESTORE UPDATES ───
  const setupRealtimeListeners = useCallback((uid: string) => {
    // Cleanup previous subscriptions
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];

    const unsubs = subscribeToUserData(uid, (data: Partial<UserDataSnapshot>) => {
      if (data.profile) setUser(data.profile);
      if (data.wallet) setWallet(data.wallet);
      if (data.holdings) setHoldings(data.holdings);
      if (data.transactions) setTransactions(data.transactions);
    });

    unsubscribersRef.current = unsubs;
  }, []);

  // ─── FIREBASE AUTH STATE LISTENER ───
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        // User is signed in — load their data from Firestore
        const profile = await loadUserData(fbUser.uid);

        if (!profile) {
          // First-time Google sign-in — create Firestore document
          const newProfile: Omit<UserProfile, 'uid'> = {
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Apex Trader',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.email || 'trader')}`,
            bio: '',
            location: '',
            experienceLevel: 'Beginner',
            favoriteAsset: '',
            createdAt: new Date().toISOString(),
            winRate: 0,
            totalTrades: 0,
            bestTrade: 0,
            worstTrade: 0,
            badge: '🌱 Novice Trader'
          };

          await createUserDocument(fbUser.uid, newProfile);
          setUser({ uid: fbUser.uid, ...newProfile });
          setWallet(DEFAULT_WALLET);
          setHoldings([]);
          setTransactions([]);
        }

        // Setup real-time listeners
        setupRealtimeListeners(fbUser.uid);
      } else {
        // User signed out — clear everything
        setUser(null);
        setWallet(DEFAULT_WALLET);
        setHoldings([]);
        setTransactions([]);
        unsubscribersRef.current.forEach((unsub) => unsub());
        unsubscribersRef.current = [];
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      unsubscribersRef.current.forEach((unsub) => unsub());
    };
  }, [loadUserData, setupRealtimeListeners]);

  // ─── REGISTER (Email/Password) ───
  const registerUser = async (displayName: string, email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, message: 'Firebase is not configured yet. Add your project values to a local .env file first.' };
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = credential.user;

      // Set display name on Firebase Auth profile
      await updateProfile(fbUser, { displayName });

      // Create Firestore user document
      const newProfile: Omit<UserProfile, 'uid'> = {
        email: fbUser.email || email,
        displayName,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        bio: '',
        location: '',
        experienceLevel: 'Beginner',
        favoriteAsset: '',
        createdAt: new Date().toISOString(),
        winRate: 0,
        totalTrades: 0,
        bestTrade: 0,
        worstTrade: 0,
        badge: '🌱 Novice Trader'
      };

      await createUserDocument(fbUser.uid, newProfile);
      setUser({ uid: fbUser.uid, ...newProfile });
      setWallet(DEFAULT_WALLET);
      setHoldings([]);
      setTransactions([]);

      setupRealtimeListeners(fbUser.uid);
      addNotification('Account Created!', `Welcome ${displayName}! Your virtual wallet starts with ₹1,00,000.`, 'success');

      return { success: true, message: 'Account created successfully!' };
    } catch (err: any) {
      console.error('Registration error:', err);
      let message = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address format.';
      }
      return { success: false, message };
    }
  };

  // ─── LOGIN (Email/Password) ───
  const loginUser = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !auth) {
      return { success: false, message: 'Firebase is not configured yet. Add your project values to a local .env file first.' };
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle loading user data
      addNotification('Welcome Back!', `Signed in as ${credential.user.displayName || email}`, 'success');
      return { success: true, message: 'Signed in successfully!' };
    } catch (err: any) {
      console.error('Login error:', err);
      let message = 'Login failed. Please try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        message = 'No account found with this email/password. Please check your credentials or sign up.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address format.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
      return { success: false, message };
    }
  };

  // ─── GOOGLE SIGN-IN ───
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      return { success: false, message: 'Firebase is not configured yet. Add your project values to a local .env file first.' };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle creating/loading user data
      addNotification('Google Sign-In', `Welcome ${result.user.displayName || 'Trader'}!`, 'success');
      return { success: true, message: 'Signed in with Google!' };
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      let message = 'Google sign-in failed. Please try again.';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled. You closed the popup window.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Popup was blocked by your browser. Please allow popups and try again.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'This domain is not allowed in Firebase Authentication. Add your local/dev domain in Firebase Auth settings.';
      } else if (err.code === 'auth/operation-not-allowed') {
        message = 'Google sign-in is not enabled in Firebase Authentication. Enable the Google provider in the Firebase console.';
      }
      return { success: false, message };
    }
  };

  // ─── LOGOUT ───
  const logout = async () => {
    if (!auth) {
      return;
    }

    try {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
      await firebaseSignOut(auth);
      // onAuthStateChanged will clear state
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // ─── UPDATE PROFILE ───
 const handleUpdateUserProfile = async (updates: Partial<UserProfile>) => {
  if (!user) return;

  try {
    // TEMPORARILY COMMENT THIS BLOCK
    /*
    if (
      firebaseUser &&
      (updates.displayName !== undefined || updates.photoURL !== undefined)
    ) {
      await updateProfile(firebaseUser, {
        displayName: updates.displayName ?? firebaseUser.displayName,
        photoURL: updates.photoURL ?? firebaseUser.photoURL
      });
    }
    */

    await updateUserProfileInDb(user.uid, updates);

    addNotification(
      'Profile Updated',
      'Your profile has been saved successfully.',
      'success'
    );
  } catch (err) {
    console.error('Profile update error:', err);
  }
};

  // ─── BUY ORDER EXECUTION ───
  const executeBuyOrder = async (asset: Asset, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Not authenticated.' };

    const totalCost = quantity * asset.price;

    if (quantity <= 0) {
      return { success: false, message: 'Please enter a valid quantity.' };
    }

    if (wallet.cashBalance < totalCost) {
      const msg = `Insufficient funds! Required ₹${totalCost.toLocaleString('en-IN')}, Available ₹${wallet.cashBalance.toLocaleString('en-IN')}`;
      addNotification('Order Failed', msg, 'error');
      return { success: false, message: msg };
    }

    try {
      // 1. Update cash balance
      const newCash = wallet.cashBalance - totalCost;

      // 2. Update or create holding
      const existing = holdings.find((h) => h.assetSymbol === asset.symbol);
      let updatedHolding: Holding;

      if (existing) {
        const newQty = existing.quantity + quantity;
        const newTotalInvestment = existing.totalInvestment + totalCost;
        const newAvgBuyPrice = newTotalInvestment / newQty;
        const newCurrentValue = newQty * asset.price;
        const newPnL = newCurrentValue - newTotalInvestment;
        const newPnLPercent = (newPnL / newTotalInvestment) * 100;

        updatedHolding = {
          ...existing,
          quantity: newQty,
          avgBuyPrice: newAvgBuyPrice,
          totalInvestment: newTotalInvestment,
          currentPrice: asset.price,
          currentValue: newCurrentValue,
          unrealizedPnL: newPnL,
          unrealizedPnLPercent: newPnLPercent
        };
      } else {
        updatedHolding = {
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
        };
      }

      // 3. Create transaction record
      const newTx: Omit<Transaction, 'id'> = {
        userId: user.uid,
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

      // 4. Compute new portfolio values
      const newHoldings = existing
        ? holdings.map((h) => (h.assetSymbol === asset.symbol ? updatedHolding : h))
        : [...holdings, updatedHolding];
      const investedAmount = newHoldings.reduce((acc, h) => acc + h.totalInvestment, 0);
      const holdingsValue = newHoldings.reduce((acc, h) => acc + h.currentValue, 0);
      const portfolioValue = newCash + holdingsValue;
      const totalProfitLoss = portfolioValue - INITIAL_CASH;
      const totalProfitLossPercent = (totalProfitLoss / INITIAL_CASH) * 100;

      // 5. Write to Firestore (all operations)
      await Promise.all([
        updateUserWallet(user.uid, {
          cashBalance: newCash,
          investedAmount,
          portfolioValue,
          totalProfitLoss,
          totalProfitLossPercent
        }),
        addOrUpdateHolding(user.uid, updatedHolding),
        addTransaction(user.uid, newTx),
        updateUserProfileInDb(user.uid, {
          totalTrades: (user.totalTrades || 0) + 1
        })
      ]);

      // Real-time listeners will update local state automatically
      const successMsg = `BUY order executed! Bought ${quantity} ${asset.symbol} @ ₹${asset.price.toLocaleString('en-IN')}`;
      addNotification('Order Executed', successMsg, 'success');
      return { success: true, message: successMsg };
    } catch (err) {
      console.error('Buy order error:', err);
      addNotification('Order Failed', 'Could not execute buy order. Please try again.', 'error');
      return { success: false, message: 'Order execution failed. Please try again.' };
    }
  };

  // ─── SELL ORDER EXECUTION ───
  const executeSellOrder = async (asset: Asset, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!user) return { success: false, message: 'Not authenticated.' };

    if (quantity <= 0) {
      return { success: false, message: 'Please enter a valid quantity.' };
    }

    const existing = holdings.find((h) => h.assetSymbol === asset.symbol);
    if (!existing || existing.quantity < quantity) {
      const msg = `Insufficient holding! You own ${existing ? existing.quantity : 0} ${asset.symbol}`;
      addNotification('Order Failed', msg, 'error');
      return { success: false, message: msg };
    }

    try {
      const totalRevenue = quantity * asset.price;
      const costBasisSold = quantity * existing.avgBuyPrice;
      const realizedPnL = totalRevenue - costBasisSold;

      // 1. Update cash
      const newCash = wallet.cashBalance + totalRevenue;

      // 2. Update or remove holding
      const newQty = existing.quantity - quantity;

      // 3. Create transaction
      const newTx: Omit<Transaction, 'id'> = {
        userId: user.uid,
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

      // 4. Calculate new portfolio values
      let newHoldings: Holding[];
      if (newQty <= 0) {
        newHoldings = holdings.filter((h) => h.assetSymbol !== asset.symbol);
      } else {
        const updatedHolding: Holding = {
          ...existing,
          quantity: newQty,
          totalInvestment: newQty * existing.avgBuyPrice,
          currentPrice: asset.price,
          currentValue: newQty * asset.price,
          unrealizedPnL: (newQty * asset.price) - (newQty * existing.avgBuyPrice),
          unrealizedPnLPercent: (((newQty * asset.price) - (newQty * existing.avgBuyPrice)) / (newQty * existing.avgBuyPrice)) * 100
        };
        newHoldings = holdings.map((h) => (h.assetSymbol === asset.symbol ? updatedHolding : h));
      }

      const investedAmount = newHoldings.reduce((acc, h) => acc + h.totalInvestment, 0);
      const holdingsValue = newHoldings.reduce((acc, h) => acc + h.currentValue, 0);
      const portfolioValue = newCash + holdingsValue;
      const totalProfitLoss = portfolioValue - INITIAL_CASH;
      const totalProfitLossPercent = (totalProfitLoss / INITIAL_CASH) * 100;

      // 5. Track best/worst trade
      const bestTrade = Math.max(user.bestTrade || 0, realizedPnL);
      const worstTrade = Math.min(user.worstTrade || 0, realizedPnL);

      // 6. Write to Firestore
      const firestoreOps: Promise<any>[] = [
        updateUserWallet(user.uid, {
          cashBalance: newCash,
          investedAmount,
          portfolioValue,
          totalProfitLoss,
          totalProfitLossPercent
        }),
        addTransaction(user.uid, newTx),
        updateUserProfileInDb(user.uid, {
          totalTrades: (user.totalTrades || 0) + 1,
          bestTrade,
          worstTrade
        })
      ];

      if (newQty <= 0) {
        firestoreOps.push(removeHolding(user.uid, asset.symbol));
      } else {
        const updatedHolding: Holding = {
          ...existing,
          quantity: newQty,
          totalInvestment: newQty * existing.avgBuyPrice,
          currentPrice: asset.price,
          currentValue: newQty * asset.price,
          unrealizedPnL: (newQty * asset.price) - (newQty * existing.avgBuyPrice),
          unrealizedPnLPercent: (((newQty * asset.price) - (newQty * existing.avgBuyPrice)) / (newQty * existing.avgBuyPrice)) * 100
        };
        firestoreOps.push(addOrUpdateHolding(user.uid, updatedHolding));
      }

      await Promise.all(firestoreOps);

      const pnlFormatted = realizedPnL >= 0 ? `+₹${realizedPnL.toFixed(2)}` : `-₹${Math.abs(realizedPnL).toFixed(2)}`;
      const successMsg = `SELL order executed! Sold ${quantity} ${asset.symbol} @ ₹${asset.price.toLocaleString('en-IN')} (P&L: ${pnlFormatted})`;
      addNotification('Order Executed', successMsg, realizedPnL >= 0 ? 'success' : 'warning');
      return { success: true, message: successMsg };
    } catch (err) {
      console.error('Sell order error:', err);
      addNotification('Order Failed', 'Could not execute sell order. Please try again.', 'error');
      return { success: false, message: 'Order execution failed. Please try again.' };
    }
  };

  // ─── CONTEXT VALUE ───
  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        isLoading,
        wallet,
        holdings,
        transactions,
        notifications,
        updateUserProfile: handleUpdateUserProfile,
        registerUser,
        loginUser,
        loginWithGoogle,
        logout,
        executeBuyOrder,
        executeSellOrder,
        dismissNotification,
        clearNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
