import React from 'react';
import {
  Calendar,
  Clock,
  Radio,
  ArrowRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Layers,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { KPICards } from '../components/KPICards';
import { ShelfCard } from '../components/ShelfCard';
import {
  type Shelf,
  type QueueEntry,
  type RetailAlert,
  type StockHistoryPoint,
} from '../services/storeService';
import { NavTab } from '../components/Sidebar';

interface DashboardViewProps {
  kpis: {
    totalShelves: number;
    inStockShelves: number;
    lowStockShelves: number;
    queueLength: number;
    totalProducts: number;
    totalUnits: number;
    systemStatus: string;
    lastUpdated: string;
  };
  shelves: Shelf[];
  queue: QueueEntry[];
  alerts: RetailAlert[];
  stockHistory: StockHistoryPoint[];
  onNavigate: (tab: NavTab) => void;
  onRestock: (shelfId: string) => void;
  onConsume: (shelfId: string) => void;
  onServeCustomer: () => void;
  onAddCustomer: () => void;
}

const DONUT_COLORS = ['#10B981', '#EF4444', '#F59E0B'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  kpis,
  shelves,
  queue,
  alerts,
  stockHistory,
  onNavigate,
  onRestock,
  onConsume,
  onServeCustomer,
  onAddCustomer,
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Data for Stock Overview Donut Chart
  const donutData = [
    { name: 'In Stock', value: kpis.inStockShelves },
    { name: 'Low Stock', value: kpis.lowStockShelves },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner and Live Clock Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Banner matching reference */}
        <div className="lg:col-span-8 bg-gradient-to-r from-[#0C1E3C] via-[#0E2856] to-[#1E40AF] rounded-3xl p-7 text-white shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          {/* Subtle background glow & geometric circles */}
          <div className="absolute -right-8 -top-8 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-36 bottom-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-lg">
            <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">
              Welcome Back,
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Smart Retail Dashboard
            </h1>
            <p className="text-sm text-blue-100/90 mt-2 font-normal leading-relaxed">
              Real-time inventory and queue monitoring for a smarter shopping experience.
            </p>
          </div>

          {/* Smart Retail Shopping Cart 3D Illustration matching reference */}
          <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-10 items-center gap-3">
            <div className="relative w-44 h-32 flex items-center justify-center">
              {/* Modern retail edge vector illustration */}
              <div className="w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center justify-center p-3 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white mb-2 shadow-md">
                  <Layers className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-[10px] font-bold text-cyan-200 uppercase tracking-wider">Edge AI Node</div>
                <div className="flex items-center gap-1 text-[9px] text-emerald-300 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Connected
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Date/Time Card matching reference */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{currentDate}</span>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="my-3">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {currentTime}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-slate-700">Live Data</span>
            </div>
            <span className="text-[11px] text-slate-400">Node sync: 100%</span>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <KPICards
        totalShelves={kpis.totalShelves}
        inStockShelves={kpis.inStockShelves}
        lowStockShelves={kpis.lowStockShelves}
        queueLength={kpis.queueLength}
        onNavigate={onNavigate}
      />

      {/* Middle Row: Shelf Status Monitoring (Left) & Real-time Queue (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Shelf Status (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Shelf Status</h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Live sensor readings from each shelf</p>
            </div>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Shelf Cards Grid (Shelf 1, Shelf 2 matching reference + Shelf 3 & 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {shelves.slice(0, 2).map(shelf => (
              <ShelfCard
                key={shelf.id}
                shelf={shelf}
                onRestock={onRestock}
                onConsume={onConsume}
              />
            ))}
          </div>

          {/* Quick link to other shelves */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing primary store shelves (2 of {shelves.length} active)</span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Manage all {shelves.length} shelves &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Real-time Queue (4 cols) matching screenshot */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900">Real-time Queue</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Customer queue at billing counter</p>
              </div>
              <button
                onClick={() => onNavigate('queue')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Queue List matching screenshot items */}
            <div className="mt-4 space-y-3">
              {queue.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Queue is clear! Billing counter is idle.
                </div>
              ) : (
                queue.slice(0, 3).map((entry, idx) => {
                  const circleBg =
                    idx === 0
                      ? 'bg-blue-600 text-white'
                      : idx === 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-amber-500 text-white';

                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${circleBg} flex items-center justify-center font-bold text-sm shadow-xs`}
                        >
                          {entry.position || idx + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{entry.customerName}</div>
                          <div className="text-[11px] text-slate-400">
                            Waiting time: {entry.estimatedWaitMinutes} min
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {entry.status === 'SERVING' ? 'Serving' : 'In Queue'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Queue action triggers */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={onServeCustomer}
              disabled={queue.length === 0}
              className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Serve Next</span>
            </button>
            <button
              onClick={onAddCustomer}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              title="Add customer to FIFO queue"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Inventory Stock Trend (Replaces Distance Trend) | Stock Overview | Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Chart 1: Inventory Stock Trend (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Inventory Stock Trend</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Recent inventory item count readings (Edge stock sensor)
              </p>
            </div>

            {/* Legend indicators matching reference colors */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-red-500"></span>
                <span className="text-slate-600">Shelf 1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600">Shelf 2</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 60]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="shelf1"
                  stroke="#EF4444"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#EF4444' }}
                  name="Shelf 1 Items"
                />
                <Line
                  type="monotone"
                  dataKey="shelf2"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981' }}
                  name="Shelf 2 Items"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Stock Overview Donut (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-base text-slate-900">Stock Overview</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Capacity health breakdown</p>
          </div>

          {/* Donut Chart with Center Text */}
          <div className="relative h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label matching reference */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-medium text-slate-400">Total</span>
              <span className="text-xs font-bold text-slate-800">{kpis.totalShelves} Shelves</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-medium text-slate-600">In Stock</span>
              </div>
              <span className="font-bold text-slate-800">
                {kpis.inStockShelves} (
                {Math.round((kpis.inStockShelves / Math.max(1, kpis.totalShelves)) * 100)}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className="font-medium text-slate-600">Low Stock</span>
              </div>
              <span className="font-bold text-slate-800">
                {kpis.lowStockShelves} (
                {Math.round((kpis.lowStockShelves / Math.max(1, kpis.totalShelves)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Recent Alerts matching screenshot (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-base text-slate-900">Recent Alerts</h3>
              </div>
              <button
                onClick={() => onNavigate('alerts')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {alerts.slice(0, 2).map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border transition-all text-xs ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-50/60 border-red-200/80'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-50/60 border-amber-200/80'
                      : 'bg-blue-50/60 border-blue-200/80'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {alert.severity === 'CRITICAL' ? (
                      <div className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{alert.title}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{alert.timestamp}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors text-center"
          >
            Manage System Alerts &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
