import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Asset } from '../types';
import { getAllAssets } from '../data/mockData';

interface MarketContextType {
  assets: Asset[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  watchlist: string[];
  toggleWatchlist: (symbol: string) => void;
  isWatchlisted: (symbol: string) => boolean;
  getAssetBySymbol: (symbol: string) => Asset | undefined;
  ticksMap: Record<string, 'up' | 'down'>;
  topGainers: Asset[];
  topLosers: Asset[];
  trendingAssets: Asset[];
  filteredAssets: Asset[];
  lastUpdated: Date;
  refreshPrices: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('apexmarket_assets');
    return saved ? JSON.parse(saved) : getAllAssets();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('apexmarket_watchlist');
    return saved ? JSON.parse(saved) : ['RELIANCE', 'BTC', 'NVDA', 'SOL', 'TCS', 'ETH'];
  });

  const [ticksMap, setTicksMap] = useState<Record<string, 'up' | 'down'>>({});
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Save watchlist
  useEffect(() => {
    localStorage.setItem('apexmarket_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Real-time market tick simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prevAssets) => {
        const nextTicks: Record<string, 'up' | 'down'> = {};
        const updated = prevAssets.map((asset) => {
          // 40% chance of price update per tick cycle
          if (Math.random() < 0.4) {
            const percentChange = (Math.random() - 0.49) * 0.008; // -0.4% to +0.4%
            const priceDiff = asset.price * percentChange;
            const newPrice = Number(Math.max(0.00001, asset.price + priceDiff).toFixed(2));
            const direction = newPrice >= asset.price ? 'up' : 'down';
            
            nextTicks[asset.symbol] = direction;

            const newChange24h = Number((asset.change24h + priceDiff).toFixed(2));
            const newChangePercent = Number(((newChange24h / (asset.price - asset.change24h)) * 100).toFixed(2));
            
            const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

            return {
              ...asset,
              price: newPrice,
              change24h: newChange24h,
              changePercent24h: newChangePercent,
              high24h: Math.max(asset.high24h, newPrice),
              low24h: Math.min(asset.low24h, newPrice),
              sparkline: updatedSparkline
            };
          }
          return asset;
        });

        setTicksMap(nextTicks);
        setLastUpdated(new Date());

        // Clear tick highlight flashes after 700ms
        setTimeout(() => {
          setTicksMap({});
        }, 700);

        return updated;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  }, []);

  const isWatchlisted = useCallback(
    (symbol: string) => watchlist.includes(symbol),
    [watchlist]
  );

  const getAssetBySymbol = useCallback(
    (symbol: string) => assets.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase()),
    [assets]
  );

  const refreshPrices = useCallback(() => {
    setAssets(getAllAssets());
    setLastUpdated(new Date());
  }, []);

  // Computed views
  const topGainers = [...assets]
    .sort((a, b) => b.changePercent24h - a.changePercent24h)
    .slice(0, 6);

  const topLosers = [...assets]
    .sort((a, b) => a.changePercent24h - b.changePercent24h)
    .slice(0, 6);

  const trendingAssets = [...assets]
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 8);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Stocks') return asset.type === 'stock';
    if (selectedCategory === 'Crypto') return asset.type === 'crypto';
    if (selectedCategory === 'Top Gainers') return asset.changePercent24h > 0;
    if (selectedCategory === 'Top Losers') return asset.changePercent24h < 0;
    if (selectedCategory === 'Watchlist') return watchlist.includes(asset.symbol);

    return true;
  });

  return (
    <MarketContext.Provider
      value={{
        assets,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        watchlist,
        toggleWatchlist,
        isWatchlisted,
        getAssetBySymbol,
        ticksMap,
        topGainers,
        topLosers,
        trendingAssets,
        filteredAssets,
        lastUpdated,
        refreshPrices
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};
