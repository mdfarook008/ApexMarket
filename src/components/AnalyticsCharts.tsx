import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid
} from 'recharts';
import { Holding, PortfolioHistoryPoint } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PortfolioGrowthChartProps {
  data: PortfolioHistoryPoint[];
}

export const PortfolioGrowthChart: React.FC<PortfolioGrowthChartProps> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#121824', borderColor: '#334155', borderRadius: '12px' }}
            formatter={(value: any) => [formatCurrency(Number(value), 'INR'), 'Portfolio Value']}
          />
          <Area
            type="monotone"
            dataKey="portfolioValue"
            stroke="#10B981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#growthGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AssetAllocationChartProps {
  holdings: Holding[];
  cashBalance: number;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1'];

export const AssetAllocationChart: React.FC<AssetAllocationChartProps> = ({ holdings, cashBalance }) => {
  const pieData = [
    { name: 'Available Cash', value: cashBalance, color: '#334155' },
    ...holdings.map((h, i) => ({
      name: h.assetSymbol,
      value: h.currentValue,
      color: COLORS[i % COLORS.length]
    }))
  ];

  return (
    <div className="h-64 w-full flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="h-56 w-full md:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0E14" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#121824', borderColor: '#334155', borderRadius: '12px' }}
              formatter={(val: any) => formatCurrency(Number(val), 'INR')}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full md:w-1/2 space-y-2 max-h-48 overflow-y-auto pr-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 font-semibold">{item.name}</span>
            </div>
            <span className="text-slate-400">{formatCurrency(item.value, 'INR')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PnLTrendChart: React.FC<{ data: PortfolioHistoryPoint[] }> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#121824', borderColor: '#334155', borderRadius: '12px' }}
            formatter={(value: any) => [formatCurrency(Number(value), 'INR'), 'Daily P&L']}
          />
          <Bar dataKey="pnL" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.pnL >= 0 ? '#10B981' : '#EF4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const VolumeActivityChart: React.FC = () => {
  const volumeData = [
    { month: 'Jan', trades: 12, volume: 124000 },
    { month: 'Feb', trades: 18, volume: 185000 },
    { month: 'Mar', trades: 14, volume: 142000 },
    { month: 'Apr', trades: 24, volume: 298000 },
    { month: 'May', trades: 30, volume: 382000 },
    { month: 'Jun', trades: 28, volume: 340000 },
    { month: 'Jul', trades: 42, volume: 512000 }
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={volumeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
          <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#121824', borderColor: '#334155', borderRadius: '12px' }}
            formatter={(val: any) => [formatCurrency(Number(val), 'INR'), 'Trading Volume']}
          />
          <Bar dataKey="volume" fill="#3B82F6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
