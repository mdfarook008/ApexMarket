import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketProvider } from './contexts/MarketContext';
import { RootLayout } from './layouts/RootLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/Dashboard';
import { MarketPage } from './pages/MarketPage';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPage } from './pages/AuthPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MarketProvider>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Page */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />

            {/* App Protected Layout */}
            <Route element={<RootLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/market/:symbol" element={<AssetDetailsPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/history" element={<TransactionHistoryPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </MarketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
