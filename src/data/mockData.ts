import { Asset, LeaderboardUser, Transaction, PortfolioHistoryPoint } from '../types';

export const INITIAL_CASH = 100000; // ₹1,00,000 Virtual Cash

export const STOCKS_DATA: Omit<Asset, 'sparkline'>[] = [
  { id: 'stk-1', symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', type: 'stock', price: 2980.50, change24h: 42.30, changePercent24h: 1.44, high24h: 3010.00, low24h: 2930.10, volume24h: 8450100, marketCap: 20150000000000, category: 'Energy & Tech', currency: 'INR' },
  { id: 'stk-2', symbol: 'TCS', name: 'Tata Consultancy Services', type: 'stock', price: 3840.00, change24h: -18.50, changePercent24h: -0.48, high24h: 3890.00, low24h: 3820.00, volume24h: 3210400, marketCap: 13950000000000, category: 'IT Services', currency: 'INR' },
  { id: 'stk-3', symbol: 'INFY', name: 'Infosys Limited', type: 'stock', price: 1545.20, change24h: 22.80, changePercent24h: 1.50, high24h: 1560.00, low24h: 1518.00, volume24h: 6540200, marketCap: 6420000000000, category: 'IT Services', currency: 'INR' },
  { id: 'stk-4', symbol: 'HDFCBANK', name: 'HDFC Bank Limited', type: 'stock', price: 1612.40, change24h: 14.10, changePercent24h: 0.88, high24h: 1625.00, low24h: 1595.00, volume24h: 12400500, marketCap: 12280000000000, category: 'Banking', currency: 'INR' },
  { id: 'stk-5', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', type: 'stock', price: 1125.80, change24h: 18.20, changePercent24h: 1.64, high24h: 1135.00, low24h: 1105.00, volume24h: 9810200, marketCap: 7910000000000, category: 'Banking', currency: 'INR' },
  { id: 'stk-6', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', type: 'stock', price: 985.60, change24h: -12.40, changePercent24h: -1.24, high24h: 1005.00, low24h: 978.00, volume24h: 15400000, marketCap: 3620000000000, category: 'Automotive', currency: 'INR' },
  { id: 'stk-7', symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'stock', price: 128.50, change24h: 5.40, changePercent24h: 4.39, high24h: 130.20, low24h: 122.10, volume24h: 48500200, marketCap: 3150000000000, category: 'Semiconductors', currency: 'USD' },
  { id: 'stk-8', symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 224.30, change24h: 2.10, changePercent24h: 0.94, high24h: 226.00, low24h: 221.80, volume24h: 38200100, marketCap: 3440000000000, category: 'Consumer Tech', currency: 'USD' },
  { id: 'stk-9', symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock', price: 215.80, change24h: -8.40, changePercent24h: -3.75, high24h: 228.00, low24h: 212.50, volume24h: 62100400, marketCap: 685000000000, category: 'Automotive & EV', currency: 'USD' },
  { id: 'stk-10', symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stock', price: 448.90, change24h: 4.20, changePercent24h: 0.94, high24h: 452.00, low24h: 442.00, volume24h: 21005000, marketCap: 3330000000000, category: 'Cloud & Software', currency: 'USD' },
  { id: 'stk-11', symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock', price: 186.40, change24h: 1.80, changePercent24h: 0.97, high24h: 188.50, low24h: 183.90, volume24h: 28400100, marketCap: 1940000000000, category: 'E-Commerce & Cloud', currency: 'USD' },
  { id: 'stk-12', symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock', price: 178.20, change24h: -1.40, changePercent24h: -0.78, high24h: 181.00, low24h: 176.50, volume24h: 22100000, marketCap: 2210000000000, category: 'Internet & Search', currency: 'USD' },
  { id: 'stk-13', symbol: 'META', name: 'Meta Platforms Inc.', type: 'stock', price: 512.60, change24h: 14.80, changePercent24h: 2.97, high24h: 518.00, low24h: 498.20, volume24h: 16500400, marketCap: 1300000000000, category: 'Social Media & AI', currency: 'USD' },
  { id: 'stk-14', symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', type: 'stock', price: 1420.10, change24h: 24.50, changePercent24h: 1.76, high24h: 1435.00, low24h: 1390.00, volume24h: 4120300, marketCap: 8120000000000, category: 'Telecom', currency: 'INR' },
  { id: 'stk-15', symbol: 'ITC', name: 'ITC Limited', type: 'stock', price: 492.30, change24h: 3.10, changePercent24h: 0.63, high24h: 496.00, low24h: 488.00, volume24h: 11200400, marketCap: 6140000000000, category: 'FMCG', currency: 'INR' },
  { id: 'stk-16', symbol: 'SBIN', name: 'State Bank of India', type: 'stock', price: 842.10, change24h: -6.40, changePercent24h: -0.75, high24h: 855.00, low24h: 836.00, volume24h: 14200100, marketCap: 7510000000000, category: 'Banking', currency: 'INR' },
  { id: 'stk-17', symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', type: 'stock', price: 6850.00, change24h: 110.00, changePercent24h: 1.63, high24h: 6920.00, low24h: 6710.00, volume24h: 1240300, marketCap: 4230000000000, category: 'FinTech & NBFC', currency: 'INR' },
  { id: 'stk-18', symbol: 'LT', name: 'Larsen & Toubro Ltd.', type: 'stock', price: 3620.40, change24h: 48.20, changePercent24h: 1.35, high24h: 3650.00, low24h: 3560.00, volume24h: 2150000, marketCap: 4980000000000, category: 'Infrastructure', currency: 'INR' },
  { id: 'stk-19', symbol: 'WIPRO', name: 'Wipro Limited', type: 'stock', price: 512.30, change24h: -4.10, changePercent24h: -0.79, high24h: 521.00, low24h: 508.00, volume24h: 7420100, marketCap: 2680000000000, category: 'IT Services', currency: 'INR' },
  { id: 'stk-20', symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', type: 'stock', price: 3180.00, change24h: 82.50, changePercent24h: 2.66, high24h: 3220.00, low24h: 3090.00, volume24h: 3820400, marketCap: 3620000000000, category: 'Conglomerate', currency: 'INR' },
  { id: 'stk-21', symbol: 'AMD', name: 'Advanced Micro Devices', type: 'stock', price: 142.20, change24h: 4.10, changePercent24h: 2.97, high24h: 145.00, low24h: 137.50, volume24h: 41200000, marketCap: 230000000000, category: 'Semiconductors', currency: 'USD' },
  { id: 'stk-22', symbol: 'INTC', name: 'Intel Corporation', type: 'stock', price: 21.40, change24h: -0.80, changePercent24h: -3.60, high24h: 22.50, low24h: 20.90, volume24h: 58400000, marketCap: 91000000000, category: 'Semiconductors', currency: 'USD' },
  { id: 'stk-23', symbol: 'NFLX', name: 'Netflix Inc.', type: 'stock', price: 642.80, change24h: 11.20, changePercent24h: 1.77, high24h: 648.00, low24h: 630.00, volume24h: 4210000, marketCap: 276000000000, category: 'Entertainment', currency: 'USD' },
  { id: 'stk-24', symbol: 'COIN', name: 'Coinbase Global Inc.', type: 'stock', price: 218.40, change24h: 12.60, changePercent24h: 6.12, high24h: 224.00, low24h: 204.10, volume24h: 14200000, marketCap: 53000000000, category: 'Crypto Platform', currency: 'USD' },
  { id: 'stk-25', symbol: 'PLTR', name: 'Palantir Technologies', type: 'stock', price: 28.90, change24h: 1.45, changePercent24h: 5.28, high24h: 29.50, low24h: 27.20, volume24h: 64200000, marketCap: 64000000000, category: 'AI & Data Analytics', currency: 'USD' },
  { id: 'stk-26', symbol: 'UBER', name: 'Uber Technologies Inc.', type: 'stock', price: 68.40, change24h: 1.20, changePercent24h: 1.79, high24h: 69.20, low24h: 66.80, volume24h: 18400000, marketCap: 142000000000, category: 'Mobility Tech', currency: 'USD' },
  { id: 'stk-27', symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', type: 'stock', price: 12450.00, change24h: 180.00, changePercent24h: 1.47, high24h: 12580.00, low24h: 12220.00, volume24h: 680200, marketCap: 3910000000000, category: 'Automotive', currency: 'INR' },
  { id: 'stk-28', symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries', type: 'stock', price: 1715.40, change24h: 19.80, changePercent24h: 1.17, high24h: 1730.00, low24h: 1690.00, volume24h: 2840000, marketCap: 4110000000000, category: 'Pharmaceuticals', currency: 'INR' },
  { id: 'stk-29', symbol: 'AXISBANK', name: 'Axis Bank Limited', type: 'stock', price: 1180.20, change24h: -8.40, changePercent24h: -0.71, high24h: 1198.00, low24h: 1172.00, volume24h: 7850000, marketCap: 3640000000000, category: 'Banking', currency: 'INR' },
  { id: 'stk-30', symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', type: 'stock', price: 1785.00, change24h: 12.00, changePercent24h: 0.68, high24h: 1800.00, low24h: 1765.00, volume24h: 3120000, marketCap: 3550000000000, category: 'Banking', currency: 'INR' },
  { id: 'stk-31', symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', type: 'stock', price: 1580.40, change24h: 22.10, changePercent24h: 1.42, high24h: 1595.00, low24h: 1550.00, volume24h: 4210000, marketCap: 4290000000000, category: 'IT Services', currency: 'INR' },
  { id: 'stk-32', symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', type: 'stock', price: 2940.00, change24h: -35.00, changePercent24h: -1.18, high24h: 2990.00, low24h: 2920.00, volume24h: 1840000, marketCap: 2820000000000, category: 'Consumer Goods', currency: 'INR' },
  { id: 'stk-33', symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', type: 'stock', price: 11200.00, change24h: 140.00, changePercent24h: 1.27, high24h: 11310.00, low24h: 11020.00, volume24h: 412000, marketCap: 3230000000000, category: 'Materials', currency: 'INR' },
  { id: 'stk-34', symbol: 'TITAN', name: 'Titan Company Ltd.', type: 'stock', price: 3410.50, change24h: 42.00, changePercent24h: 1.25, high24h: 3440.00, low24h: 3360.00, volume24h: 1950000, marketCap: 3020000000000, category: 'Consumer Luxury', currency: 'INR' },
  { id: 'stk-35', symbol: 'NTPC', name: 'NTPC Limited', type: 'stock', price: 410.20, change24h: 6.80, changePercent24h: 1.69, high24h: 415.00, low24h: 402.00, volume24h: 18400000, marketCap: 3980000000000, category: 'Utilities & Power', currency: 'INR' },
  { id: 'stk-36', symbol: 'ONGC', name: 'Oil & Natural Gas Corp', type: 'stock', price: 325.40, change24h: 8.20, changePercent24h: 2.59, high24h: 329.00, low24h: 315.00, volume24h: 24100000, marketCap: 4090000000000, category: 'Energy', currency: 'INR' },
  { id: 'stk-37', symbol: 'POWERGRID', name: 'Power Grid Corp of India', type: 'stock', price: 342.80, change24h: -2.10, changePercent24h: -0.61, high24h: 348.00, low24h: 340.00, volume24h: 12800000, marketCap: 3180000000000, category: 'Utilities', currency: 'INR' },
  { id: 'stk-38', symbol: 'TATASTEEL', name: 'Tata Steel Limited', type: 'stock', price: 162.40, change24h: 2.10, changePercent24h: 1.31, high24h: 165.00, low24h: 159.50, volume24h: 32100000, marketCap: 2020000000000, category: 'Metals & Steel', currency: 'INR' },
  { id: 'stk-39', symbol: 'MAHMGFIN', name: 'Mahindra & Mahindra Ltd.', type: 'stock', price: 2910.00, change24h: 54.00, changePercent24h: 1.89, high24h: 2940.00, low24h: 2840.00, volume24h: 4820000, marketCap: 3500000000000, category: 'Automotive', currency: 'INR' },
  { id: 'stk-40', symbol: 'NESTLEIND', name: 'Nestle India Ltd.', type: 'stock', price: 2540.00, change24h: -15.00, changePercent24h: -0.59, high24h: 2570.00, low24h: 2525.00, volume24h: 840000, marketCap: 2450000000000, category: 'FMCG', currency: 'INR' },
  { id: 'stk-41', symbol: 'DIS', name: 'The Walt Disney Company', type: 'stock', price: 92.40, change24h: -1.20, changePercent24h: -1.28, high24h: 94.20, low24h: 91.80, volume24h: 9800000, marketCap: 168000000000, category: 'Entertainment', currency: 'USD' },
  { id: 'stk-42', symbol: 'PEP', name: 'PepsiCo Inc.', type: 'stock', price: 172.50, change24h: 1.10, changePercent24h: 0.64, high24h: 174.00, low24h: 170.80, volume24h: 5400000, marketCap: 236000000000, category: 'Consumer Goods', currency: 'USD' },
  { id: 'stk-43', symbol: 'KO', name: 'The Coca-Cola Company', type: 'stock', price: 68.20, change24h: 0.45, changePercent24h: 0.66, high24h: 68.90, low24h: 67.50, volume24h: 12400000, marketCap: 294000000000, category: 'Consumer Goods', currency: 'USD' },
  { id: 'stk-44', symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'stock', price: 208.60, change24h: 3.40, changePercent24h: 1.66, high24h: 210.50, low24h: 204.20, volume24h: 8900000, marketCap: 595000000000, category: 'Banking', currency: 'USD' },
  { id: 'stk-45', symbol: 'V', name: 'Visa Inc.', type: 'stock', price: 268.40, change24h: 2.10, changePercent24h: 0.79, high24h: 271.00, low24h: 265.80, volume24h: 6200000, marketCap: 548000000000, category: 'Financial Tech', currency: 'USD' },
  { id: 'stk-46', symbol: 'MA', name: 'Mastercard Inc.', type: 'stock', price: 454.20, change24h: 5.60, changePercent24h: 1.25, high24h: 458.00, low24h: 447.50, volume24h: 3100000, marketCap: 422000000000, category: 'Financial Tech', currency: 'USD' },
  { id: 'stk-47', symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', type: 'stock', price: 4720.00, change24h: 135.00, changePercent24h: 2.94, high24h: 4780.00, low24h: 4560.00, volume24h: 3840000, marketCap: 3150000000000, category: 'Defense & Aero', currency: 'INR' },
  { id: 'stk-48', symbol: 'BEL', name: 'Bharat Electronics Ltd.', type: 'stock', price: 308.50, change24h: 7.20, changePercent24h: 2.39, high24h: 312.00, low24h: 299.00, volume24h: 21500000, marketCap: 2250000000000, category: 'Defense', currency: 'INR' },
  { id: 'stk-49', symbol: 'ZOMATO', name: 'Zomato Limited', type: 'stock', price: 262.40, change24h: 12.80, changePercent24h: 5.13, high24h: 268.00, low24h: 247.00, volume24h: 48500000, marketCap: 2320000000000, category: 'Consumer Tech', currency: 'INR' },
  { id: 'stk-50', symbol: 'PAYTM', name: 'One97 Communications Ltd.', type: 'stock', price: 540.20, change24h: -18.40, changePercent24h: -3.30, high24h: 565.00, low24h: 532.00, volume24h: 14200000, marketCap: 342000000000, category: 'FinTech', currency: 'INR' },
];

export const CRYPTO_DATA: Omit<Asset, 'sparkline'>[] = [
  { id: 'cry-1', symbol: 'BTC', name: 'Bitcoin', type: 'crypto', price: 62450.00, change24h: 2150.00, changePercent24h: 3.57, high24h: 63200.00, low24h: 59800.00, volume24h: 28400000000, marketCap: 1230000000000, category: 'Layer 1 / Currency', currency: 'USD' },
  { id: 'cry-2', symbol: 'ETH', name: 'Ethereum', type: 'crypto', price: 2715.40, change24h: 84.20, changePercent24h: 3.20, high24h: 2760.00, low24h: 2610.00, volume24h: 14500000000, marketCap: 326000000000, category: 'Smart Contracts', currency: 'USD' },
  { id: 'cry-3', symbol: 'SOL', name: 'Solana', type: 'crypto', price: 148.60, change24h: 9.80, changePercent24h: 7.06, high24h: 152.00, low24h: 137.50, volume24h: 3200000000, marketCap: 69000000000, category: 'Layer 1', currency: 'USD' },
  { id: 'cry-4', symbol: 'BNB', name: 'BNB', type: 'crypto', price: 534.20, change24h: 12.10, changePercent24h: 2.32, high24h: 542.00, low24h: 518.00, volume24h: 980000000, marketCap: 78000000000, category: 'Exchange / L1', currency: 'USD' },
  { id: 'cry-5', symbol: 'XRP', name: 'XRP', type: 'crypto', price: 0.584, change24h: 0.032, changePercent24h: 5.80, high24h: 0.605, low24h: 0.542, volume24h: 1850000000, marketCap: 32800000000, category: 'Payments', currency: 'USD' },
  { id: 'cry-6', symbol: 'ADA', name: 'Cardano', type: 'crypto', price: 0.352, change24h: -0.012, changePercent24h: -3.30, high24h: 0.370, low24h: 0.345, volume24h: 420000000, marketCap: 12600000000, category: 'Smart Contracts', currency: 'USD' },
  { id: 'cry-7', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', price: 0.108, change24h: 0.007, changePercent24h: 6.93, high24h: 0.112, low24h: 0.099, volume24h: 890000000, marketCap: 15800000000, category: 'Meme', currency: 'USD' },
  { id: 'cry-8', symbol: 'AVAX', name: 'Avalanche', type: 'crypto', price: 23.40, change24h: 1.60, changePercent24h: 7.34, high24h: 24.20, low24h: 21.50, volume24h: 310000000, marketCap: 9200000000, category: 'Layer 1', currency: 'USD' },
  { id: 'cry-9', symbol: 'LINK', name: 'Chainlink', type: 'crypto', price: 11.20, change24h: 0.75, changePercent24h: 7.18, high24h: 11.60, low24h: 10.30, volume24h: 240000000, marketCap: 6800000000, category: 'Oracles & Infrastructure', currency: 'USD' },
  { id: 'cry-10', symbol: 'DOT', name: 'Polkadot', type: 'crypto', price: 4.85, change24h: 0.22, changePercent24h: 4.75, high24h: 4.98, low24h: 4.58, volume24h: 180000000, marketCap: 6900000000, category: 'Interoperability', currency: 'USD' },
  { id: 'cry-11', symbol: 'MATIC', name: 'Polygon', type: 'crypto', price: 0.428, change24h: 0.018, changePercent24h: 4.39, high24h: 0.445, low24h: 0.405, volume24h: 210000000, marketCap: 4200000000, category: 'Layer 2', currency: 'USD' },
  { id: 'cry-12', symbol: 'SHIB', name: 'Shiba Inu', type: 'crypto', price: 0.0000142, change24h: 0.0000008, changePercent24h: 5.97, high24h: 0.0000148, low24h: 0.0000132, volume24h: 450000000, marketCap: 8300000000, category: 'Meme', currency: 'USD' },
  { id: 'cry-13', symbol: 'NEAR', name: 'NEAR Protocol', type: 'crypto', price: 4.50, change24h: 0.38, changePercent24h: 9.22, high24h: 4.65, low24h: 4.05, volume24h: 380000000, marketCap: 5000000000, category: 'AI & Layer 1', currency: 'USD' },
  { id: 'cry-14', symbol: 'UNI', name: 'Uniswap', type: 'crypto', price: 6.75, change24h: 0.42, changePercent24h: 6.63, high24h: 6.90, low24h: 6.25, volume24h: 160000000, marketCap: 4050000000, category: 'DeFi', currency: 'USD' },
  { id: 'cry-15', symbol: 'ATOM', name: 'Cosmos', type: 'crypto', price: 4.95, change24h: 0.18, changePercent24h: 3.77, high24h: 5.10, low24h: 4.72, volume24h: 110000000, marketCap: 1950000000, category: 'Interoperability', currency: 'USD' },
  { id: 'cry-16', symbol: 'PEPE', name: 'Pepe', type: 'crypto', price: 0.0000082, change24h: 0.0000009, changePercent24h: 12.33, high24h: 0.0000086, low24h: 0.0000071, volume24h: 620000000, marketCap: 3450000000, category: 'Meme', currency: 'USD' },
  { id: 'cry-17', symbol: 'SUI', name: 'Sui', type: 'crypto', price: 0.94, change24h: 0.12, changePercent24h: 14.63, high24h: 0.98, low24h: 0.81, volume24h: 410000000, marketCap: 2450000000, category: 'Layer 1', currency: 'USD' },
  { id: 'cry-18', symbol: 'APT', name: 'Aptos', type: 'crypto', price: 6.40, change24h: 0.35, changePercent24h: 5.79, high24h: 6.65, low24h: 5.95, volume24h: 180000000, marketCap: 3020000000, category: 'Layer 1', currency: 'USD' },
  { id: 'cry-19', symbol: 'ARB', name: 'Arbitrum', type: 'crypto', price: 0.54, change24h: -0.02, changePercent24h: -3.57, high24h: 0.57, low24h: 0.52, volume24h: 190000000, marketCap: 1800000000, category: 'Layer 2', currency: 'USD' },
  { id: 'cry-20', symbol: 'OP', name: 'Optimism', type: 'crypto', price: 1.42, change24h: 0.08, changePercent24h: 5.97, high24h: 1.48, low24h: 1.32, volume24h: 140000000, marketCap: 1680000000, category: 'Layer 2', currency: 'USD' },
  { id: 'cry-21', symbol: 'LTC', name: 'Litecoin', type: 'crypto', price: 64.20, change24h: 1.80, changePercent24h: 2.88, high24h: 65.50, low24h: 62.00, volume24h: 290000000, marketCap: 4800000000, category: 'Payments', currency: 'USD' },
  { id: 'cry-22', symbol: 'BCH', name: 'Bitcoin Cash', type: 'crypto', price: 342.10, change24h: 14.50, changePercent24h: 4.43, high24h: 350.00, low24h: 325.00, volume24h: 210000000, marketCap: 6750000000, category: 'Payments', currency: 'USD' },
  { id: 'cry-23', symbol: 'XMR', name: 'Monero', type: 'crypto', price: 154.80, change24h: -2.40, changePercent24h: -1.53, high24h: 158.00, low24h: 152.00, volume24h: 65000000, marketCap: 2840000000, category: 'Privacy', currency: 'USD' },
  { id: 'cry-24', symbol: 'XLM', name: 'Stellar', type: 'crypto', price: 0.098, change24h: 0.004, changePercent24h: 4.26, high24h: 0.102, low24h: 0.093, volume24h: 95000000, marketCap: 2880000000, category: 'Payments', currency: 'USD' },
  { id: 'cry-25', symbol: 'ICP', name: 'Internet Computer', type: 'crypto', price: 7.85, change24h: 0.42, changePercent24h: 5.65, high24h: 8.10, low24h: 7.35, volume24h: 88000000, marketCap: 3680000000, category: 'Infrastructure', currency: 'USD' },
  { id: 'cry-26', symbol: 'RENDER', name: 'Render Token', type: 'crypto', price: 5.10, change24h: 0.45, changePercent24h: 9.68, high24h: 5.30, low24h: 4.58, volume24h: 180000000, marketCap: 2000000000, category: 'AI & GPU', currency: 'USD' },
  { id: 'cry-27', symbol: 'FET', name: 'Artificial Superintelligence', type: 'crypto', price: 1.28, change24h: 0.14, changePercent24h: 12.28, high24h: 1.35, low24h: 1.12, volume24h: 240000000, marketCap: 3200000000, category: 'AI & Compute', currency: 'USD' },
  { id: 'cry-28', symbol: 'INJ', name: 'Injective', type: 'crypto', price: 18.50, change24h: 1.20, changePercent24h: 6.94, high24h: 19.20, low24h: 17.10, volume24h: 145000000, marketCap: 1720000000, category: 'DeFi & L1', currency: 'USD' },
  { id: 'cry-29', symbol: 'TIA', name: 'Celestia', type: 'crypto', price: 5.60, change24h: 0.32, changePercent24h: 6.06, high24h: 5.85, low24h: 5.20, volume24h: 110000000, marketCap: 1150000000, category: 'Modular L1', currency: 'USD' },
  { id: 'cry-30', symbol: 'FIL', name: 'Filecoin', type: 'crypto', price: 3.85, change24h: 0.12, changePercent24h: 3.22, high24h: 3.98, low24h: 3.68, volume24h: 92000000, marketCap: 2180000000, category: 'Storage', currency: 'USD' }
];

// Helper to generate sparklines
export function generateSparkline(basePrice: number, points = 20): number[] {
  const line = [basePrice];
  let current = basePrice;
  for (let i = 1; i < points; i++) {
    const variation = (Math.random() - 0.48) * 0.03 * current;
    current = Math.max(current + variation, basePrice * 0.5);
    line.push(Number(current.toFixed(2)));
  }
  return line;
}

export function getAllAssets(): Asset[] {
  const stocks = STOCKS_DATA.map(item => ({
    ...item,
    sparkline: generateSparkline(item.price)
  }));
  const cryptos = CRYPTO_DATA.map(item => ({
    ...item,
    sparkline: generateSparkline(item.price)
  }));
  return [...stocks, ...cryptos];
}

// Generate realistic candle chart history for an asset
export function generatePriceHistory(basePrice: number, timeframe: '1D' | '1W' | '1M' | '1Y' | 'ALL' = '1D') {
  let count = 24;
  let intervalLabel = 'hour';
  
  if (timeframe === '1D') { count = 24; intervalLabel = 'Hour'; }
  else if (timeframe === '1W') { count = 28; intervalLabel = 'Day'; }
  else if (timeframe === '1M') { count = 30; intervalLabel = 'Day'; }
  else if (timeframe === '1Y') { count = 52; intervalLabel = 'Week'; }
  else { count = 60; intervalLabel = 'Month'; }

  const data = [];
  let currentPrice = basePrice * (timeframe === '1Y' ? 0.75 : timeframe === '1M' ? 0.9 : 0.98);

  const now = new Date();

  for (let i = count; i >= 0; i--) {
    const d = new Date(now.getTime() - i * (timeframe === '1D' ? 3600000 : timeframe === '1W' ? 6 * 3600000 : 24 * 3600000));
    const timeStr = timeframe === '1D' ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    
    const change = (Math.random() - 0.47) * 0.025 * currentPrice;
    const open = currentPrice;
    currentPrice = Math.max(open + change, basePrice * 0.2);
    const high = Math.max(open, currentPrice) + Math.random() * 0.01 * currentPrice;
    const low = Math.min(open, currentPrice) - Math.random() * 0.01 * currentPrice;
    const volume = Math.floor(Math.random() * 50000 + 10000);

    data.push({
      timestamp: d.toISOString(),
      time: timeStr,
      price: Number(currentPrice.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(currentPrice.toFixed(2)),
      volume
    });
  }

  // Ensure last candle lands close to basePrice
  if (data.length > 0) {
    data[data.length - 1].price = basePrice;
    data[data.length - 1].close = basePrice;
  }

  return data;
}

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, userId: 'usr-101', displayName: 'Aarav "Alpha" Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', portfolioValue: 342850, totalProfit: 242850, returnPercent: 242.85, topHolding: 'RELIANCE', badge: '👑 Diamond Hands' },
  { rank: 2, userId: 'usr-102', displayName: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', portfolioValue: 289400, totalProfit: 189400, returnPercent: 189.40, topHolding: 'NVDA', badge: '🚀 Tech Bull' },
  { rank: 3, userId: 'usr-103', displayName: 'Vikram "Quant" Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', portfolioValue: 254120, totalProfit: 154120, returnPercent: 154.12, topHolding: 'SOL', badge: '⚡ Crypto Scalper' },
  { rank: 4, userId: 'usr-104', displayName: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', portfolioValue: 218900, totalProfit: 118900, returnPercent: 118.90, topHolding: 'BTC', badge: '🧠 Algo Trader' },
  { rank: 5, userId: 'usr-105', displayName: 'Rohan Deshmukh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', portfolioValue: 194300, totalProfit: 94300, returnPercent: 94.30, topHolding: 'TCS', badge: '🛡️ Value Investor' },
  { rank: 6, userId: 'usr-106', displayName: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', portfolioValue: 182600, totalProfit: 82600, returnPercent: 82.60, topHolding: 'ETH', badge: '💎 HODLer' },
  { rank: 7, userId: 'usr-107', displayName: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', portfolioValue: 174200, totalProfit: 74200, returnPercent: 74.20, topHolding: 'INFY', badge: '📈 Momentum Guru' },
  { rank: 8, userId: 'usr-108', displayName: 'Devansh Kulkarni', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', portfolioValue: 165800, totalProfit: 65800, returnPercent: 65.80, topHolding: 'TATAMOTORS', badge: '🏎️ EV Rider' },
  { rank: 9, userId: 'usr-109', displayName: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80', portfolioValue: 159400, totalProfit: 59400, returnPercent: 59.40, topHolding: 'HDFCBANK', badge: '🏦 Banking Titan' },
  { rank: 10, userId: 'usr-110', displayName: 'Lucas Silva', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80', portfolioValue: 152100, totalProfit: 52100, returnPercent: 52.10, topHolding: 'TSLA', badge: '⚡ High Volatility' },
  { rank: 11, userId: 'usr-111', displayName: 'Kavya Singh', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=80', portfolioValue: 148500, totalProfit: 48500, returnPercent: 48.50, topHolding: 'AVAX', badge: '🌐 Web3 Strategist' },
  { rank: 12, userId: 'usr-112', displayName: 'Arjun Verma', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', portfolioValue: 143200, totalProfit: 43200, returnPercent: 43.20, topHolding: 'MSFT', badge: '💻 SaaS Wizard' },
  { rank: 13, userId: 'usr-113', displayName: 'Zoe Martinez', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', portfolioValue: 139000, totalProfit: 39000, returnPercent: 39.00, topHolding: 'AMZN', badge: '🛒 Retail King' },
  { rank: 14, userId: 'usr-114', displayName: 'Siddharth Nair', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80', portfolioValue: 134500, totalProfit: 34500, returnPercent: 34.50, topHolding: 'BAJFINANCE', badge: '📊 FinTech Pro' },
  { rank: 15, userId: 'usr-115', displayName: 'Nisha Kapoor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', portfolioValue: 131200, totalProfit: 31200, returnPercent: 31.20, topHolding: 'META', badge: '🤖 AI Specialist' },
  { rank: 16, userId: 'usr-116', displayName: 'Liam O\'Connor', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', portfolioValue: 128400, totalProfit: 28400, returnPercent: 28.40, topHolding: 'LINK', badge: '🔮 Oracle Master' },
  { rank: 17, userId: 'usr-117', displayName: 'Aditi Joshi', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80', portfolioValue: 125100, totalProfit: 25100, returnPercent: 25.10, topHolding: 'BHARTIARTL', badge: '📡 Telecom Wave' },
  { rank: 18, userId: 'usr-118', displayName: 'Kabir Malhotra', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', portfolioValue: 121800, totalProfit: 21800, returnPercent: 21.80, topHolding: 'ZOMATO', badge: '🍕 Consumer Hype' },
  { rank: 19, userId: 'usr-119', displayName: 'Chloe Taylor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', portfolioValue: 118200, totalProfit: 18200, returnPercent: 18.20, topHolding: 'AMD', badge: '🔥 Silicon Chip' },
  { rank: 20, userId: 'usr-120', displayName: 'Ishaan Pillai', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', portfolioValue: 114500, totalProfit: 14500, returnPercent: 14.50, topHolding: 'ITC', badge: '🌱 Steady Growth' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-101', userId: 'demo-user', assetSymbol: 'RELIANCE', assetName: 'Reliance Industries Ltd.', type: 'BUY', orderType: 'MARKET', quantity: 10, price: 2938.20, totalAmount: 29382.00, timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'COMPLETED' },
  { id: 'tx-102', userId: 'demo-user', assetSymbol: 'BTC', assetName: 'Bitcoin', type: 'BUY', orderType: 'MARKET', quantity: 0.05, price: 60100.00, totalAmount: 3005.00, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'COMPLETED' },
  { id: 'tx-103', userId: 'demo-user', assetSymbol: 'TCS', assetName: 'Tata Consultancy Services', type: 'BUY', orderType: 'MARKET', quantity: 5, price: 3820.00, totalAmount: 19100.00, timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'COMPLETED' },
  { id: 'tx-104', userId: 'demo-user', assetSymbol: 'SOL', assetName: 'Solana', type: 'BUY', orderType: 'MARKET', quantity: 15, price: 138.40, totalAmount: 2076.00, timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'COMPLETED' },
  { id: 'tx-105', userId: 'demo-user', assetSymbol: 'RELIANCE', assetName: 'Reliance Industries Ltd.', type: 'SELL', orderType: 'MARKET', quantity: 3, price: 2975.00, totalAmount: 8925.00, timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'COMPLETED' },
];

export const INITIAL_PORTFOLIO_HISTORY: PortfolioHistoryPoint[] = [
  { date: '7 Days Ago', portfolioValue: 100000, cashBalance: 100000, investedAmount: 0, pnL: 0 },
  { date: '6 Days Ago', portfolioValue: 101200, cashBalance: 70618, investedAmount: 29382, pnL: 1200 },
  { date: '5 Days Ago', portfolioValue: 102450, cashBalance: 67613, investedAmount: 32387, pnL: 2450 },
  { date: '4 Days Ago', portfolioValue: 101800, cashBalance: 48513, investedAmount: 51487, pnL: 1800 },
  { date: '3 Days Ago', portfolioValue: 104200, cashBalance: 48513, investedAmount: 53563, pnL: 4200 },
  { date: '2 Days Ago', portfolioValue: 106850, cashBalance: 57438, investedAmount: 44637, pnL: 6850 },
  { date: 'Today', portfolioValue: 108420, cashBalance: 57438, investedAmount: 44637, pnL: 8420 }
];
