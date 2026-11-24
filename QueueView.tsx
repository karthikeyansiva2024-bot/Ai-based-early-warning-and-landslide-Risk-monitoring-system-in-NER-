import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Clock,
  Trash2,
  Download,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { type QueueEntry } from '../utils/retailAnalytics';
import { type QueueHistoryPoint } from '../services/storeService';

interface QueueViewProps {
  queue: QueueEntry[];
  queueHistory: QueueHistoryPoint[];
  servedTodayCount: number;
  onAddCustomer: (name: string, itemsCount: number) => void;
  onServeNext: () => void;
  onCompleteCustomer: (id?: string) => void;
  onRemoveCustomer: (id: string) => void;
  onExportCSV: () => void;
}

export const QueueView: React.FC<QueueViewProps> = ({
  queue,
  queueHistory,
  servedTodayCount,
  onAddCustomer,
  onServeNext,
  onCompleteCustomer,
  onRemoveCustomer,
  onExportCSV,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [cartItems, setCartItems] = useState(5);

  const waitingQueue = queue.filter(q => q.status === 'WAITING');
  const servingCustomer = queue.find(q => q.status === 'SERVING');

  const totalWaitTime = waitingQueue.reduce((acc, q) => acc + q.estimatedWaitMinutes, 0);
  const avgWaitTime = waitingQueue.length > 0 ? (totalWaitTime / waitingQueue.length).toFixed(1) : '0';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer(custName.trim() || `Customer ${queue.length + 1}`, cartItems);
    setCustName('');
    setCartItems(5);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Real-time Queue Monitoring</h1>
              <p className="text-xs text-slate-500">FIFO (First-In, First-Out) customer flow optimization and cashier dispatch</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200/80"
          >
            <Download className="w-4 h-4" />
            <span>Export Queue CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Queue Performance Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Currently Waiting</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{waitingQueue.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">FIFO Position Depth</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Wait Time</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {avgWaitTime} <span className="text-sm font-normal text-slate-500">mins</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">~15s service time / cart item</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Served Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{servedTodayCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Completed checkouts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Counter</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {servingCustomer ? 'Counter 1' : 'Idle'}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            {servingCustomer ? `Serving ${servingCustomer.customerName}` : 'Ready for next customer'}
          </div>
        </div>
      </div>

      {/* Active Cashier Service Station & FIFO Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Active Serving Station (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E1B4B] to-[#312E81] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-indigo-700/60">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-300" />
                <h3 className="font-bold text-sm">Checkout Counter 1 (Primary)</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {servingCustomer ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-extrabold text-lg shadow-inner">
                    NOW
                  </div>
                  <div>
                    <span className="text-xs text-indigo-300 font-semibold uppercase">Currently at Register</span>
                    <h4 className="text-xl font-extrabold text-white">{servingCustomer.customerName}</h4>
                    <p className="text-xs text-indigo-200 mt-0.5">ID: {servingCustomer.customerId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="bg-indigo-950/60 p-3 rounded-2xl border border-indigo-800">
                    <span className="text-[11px] text-indigo-300">Items in Basket</span>
                    <div className="text-lg font-bold mt-0.5">{servingCustomer.itemsCount} items</div>
                  </div>
                  <div className="bg-indigo-950/60 p-3 rounded-2xl border border-indigo-800">
                    <span className="text-[11px] text-indigo-300">Service Estimate</span>
                    <div className="text-lg font-bold mt-0.5">~{servingCustomer.estimatedWaitMinutes} mins</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-indigo-300 space-y-2">
                <UserCheck className="w-10 h-10 mx-auto text-indigo-400 opacity-60" />
                <p className="text-sm font-semibold">Counter is currently free</p>
                <p className="text-xs text-indigo-300/80">Click &quot;Call Next Customer&quot; to begin scanning basket</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-indigo-700/60 flex items-center gap-3">
            {servingCustomer ? (
              <button
                onClick={() => onCompleteCustomer(servingCustomer.id)}
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Checkout &amp; Bagging</span>
              </button>
            ) : (
              <button
                onClick={onServeNext}
                disabled={waitingQueue.length === 0}
                className="w-full py-2.5 px-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Call Next Customer (FIFO #{waitingQueue[0]?.position || 1})</span>
              </button>
            )}
          </div>
        </div>

        {/* Live FIFO Queue Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-900">Waiting Line (FIFO Order)</h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                {waitingQueue.length} Waiting
              </span>
            </div>

            <div className="mt-4 space-y-2.5 max-h-72 overflow-y-auto">
              {waitingQueue.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No customers waiting in line.
                </div>
              ) : (
                waitingQueue.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        #{item.position}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{item.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {item.customerId} • {item.itemsCount} items in cart
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-800">~{item.estimatedWaitMinutes} min</div>
                        <div className="text-[10px] text-slate-400">Est. wait</div>
                      </div>

                      <button
                        onClick={() => onRemoveCustomer(item.id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Automated position priority enforcement</span>
            <button
              onClick={() => onAddCustomer(`Customer ${queue.length + 1}`, Math.floor(Math.random() * 8) + 2)}
              className="text-purple-600 font-bold hover:underline"
            >
              + Quick Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Queue Historical Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Waiting Time Trend (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Queue Waiting Time Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Hourly customer wait times (minutes)</p>
            </div>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={queueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  dataKey="avgWaitMinutes"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#8B5CF6' }}
                  name="Avg Wait (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Throughput Area Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Customer Queue Statistics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Customers served vs waiting depth</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={queueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="servedCount"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.2}
                  name="Customers Served"
                />
                <Area
                  type="monotone"
                  dataKey="waitingCount"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.2}
                  name="Customers In Line"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Enqueue Customer (FIFO)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Name / Label</label>
                <input
                  type="text"
                  value={custName}
                  onChange={e => setCustName(e.target.value)}
                  placeholder="e.g. Eleanor Vance or Customer 4"
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cart Items Count: <strong className="text-purple-600">{cartItems}</strong> items
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={cartItems}
                  onChange={e => setCartItems(parseInt(e.target.value) || 1)}
                  className="w-full accent-purple-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>Quick basket (1 item)</span>
                  <span>Full trolley (25 items)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Add to FIFO Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
