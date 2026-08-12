import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  serverTimestamp,
  Timestamp,
  type Firestore
} from 'firebase/firestore';
import { db } from '../firebase/config';

function requireFirestore(): Firestore {
  if (!db) {
    throw new Error('Firestore is not configured. Please set the Firebase config values in .env.');
  }
  return db;
}
import { UserProfile, UserWallet, Holding, Transaction } from '../types';

// ─── INITIAL VALUES ───
export const INITIAL_CASH = 100000;

const DEFAULT_WALLET: UserWallet = {
  cashBalance: INITIAL_CASH,
  investedAmount: 0,
  portfolioValue: INITIAL_CASH,
  totalProfitLoss: 0,
  totalProfitLossPercent: 0
};

// ─── USER PROFILE ───

export async function createUserDocument(
  uid: string,
  profile: Omit<UserProfile, 'uid'>,
): Promise<void> {
  const userRef = doc(requireFirestore(), 'users', uid);
  await setDoc(userRef, {
    ...profile,
    uid,
    createdAt: profile.createdAt || new Date().toISOString(),
  });

  // Create default wallet sub-document
  const walletRef = doc(requireFirestore(), 'users', uid, 'wallet', 'current');
  await setDoc(walletRef, DEFAULT_WALLET);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(requireFirestore(), 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfileInDb(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(requireFirestore(), 'users', uid);
  await updateDoc(userRef, updates);
}

// ─── WALLET ───

export async function getUserWallet(uid: string): Promise<UserWallet> {
  const walletRef = doc(requireFirestore(), 'users', uid, 'wallet', 'current');
  const snap = await getDoc(walletRef);
  if (!snap.exists()) return DEFAULT_WALLET;
  return snap.data() as UserWallet;
}

export async function updateUserWallet(uid: string, wallet: Partial<UserWallet>): Promise<void> {
  const walletRef = doc(requireFirestore(), 'users', uid, 'wallet', 'current');
  const snap = await getDoc(walletRef);
  if (snap.exists()) {
    await updateDoc(walletRef, wallet);
  } else {
    await setDoc(walletRef, { ...DEFAULT_WALLET, ...wallet });
  }
}

// ─── HOLDINGS ───

export async function getUserHoldings(uid: string): Promise<Holding[]> {
  const holdingsRef = collection(requireFirestore(), 'users', uid, 'holdings');
  const snap = await getDocs(holdingsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Holding));
}

export async function addOrUpdateHolding(uid: string, holding: Holding): Promise<void> {
  const holdingRef = doc(requireFirestore(), 'users', uid, 'holdings', holding.assetSymbol);
  await setDoc(holdingRef, holding, { merge: true });
}

export async function removeHolding(uid: string, assetSymbol: string): Promise<void> {
  const holdingRef = doc(requireFirestore(), 'users', uid, 'holdings', assetSymbol);
  await deleteDoc(holdingRef);
}

// ─── TRANSACTIONS ───

export async function getUserTransactions(uid: string): Promise<Transaction[]> {
  const txRef = collection(requireFirestore(), 'users', uid, 'transactions');
  const q = query(txRef, orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
}

export async function addTransaction(uid: string, transaction: Omit<Transaction, 'id'>): Promise<string> {
  const txRef = collection(requireFirestore(), 'users', uid, 'transactions');
  const docRef = await addDoc(txRef, transaction);
  return docRef.id;
}

// ─── REAL-TIME SUBSCRIPTIONS ───

export interface UserDataSnapshot {
  profile: UserProfile | null;
  wallet: UserWallet;
  holdings: Holding[];
  transactions: Transaction[];
}

export function subscribeToUserData(
  uid: string,
  onUpdate: (data: Partial<UserDataSnapshot>) => void
): Unsubscribe[] {
  const unsubscribers: Unsubscribe[] = [];

  // Subscribe to profile
  const userRef = doc(requireFirestore(), 'users', uid);
  unsubscribers.push(
    onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        onUpdate({ profile: snap.data() as UserProfile });
      }
    })
  );

  // Subscribe to wallet
  const walletRef = doc(requireFirestore(), 'users', uid, 'wallet', 'current');
  unsubscribers.push(
    onSnapshot(walletRef, (snap) => {
      if (snap.exists()) {
        onUpdate({ wallet: snap.data() as UserWallet });
      }
    })
  );

  // Subscribe to holdings
  const holdingsRef = collection(requireFirestore(), 'users', uid, 'holdings');
  unsubscribers.push(
    onSnapshot(holdingsRef, (snap) => {
      const holdings = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Holding));
      onUpdate({ holdings });
    })
  );

  // Subscribe to transactions (latest 50)
  const txRef = collection(requireFirestore(), 'users', uid, 'transactions');
  const txQuery = query(txRef, orderBy('timestamp', 'desc'));
  unsubscribers.push(
    onSnapshot(txQuery, (snap) => {
      const transactions = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
      onUpdate({ transactions });
    })
  );

  return unsubscribers;
}
