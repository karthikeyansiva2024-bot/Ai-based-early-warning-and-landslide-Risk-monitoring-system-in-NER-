import React from 'react';
import { Box, CheckCircle, AlertTriangle, Users, ArrowRight } from 'lucide-react';

interface KPICardsProps {
  totalShelves: number;
  inStockShelves: number;
  lowStockShelves: number;
  queueLength: number;
  onNavigate: (tab: 'dashboard' | 'inventory' | 'queue' | 'alerts') => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalShelves,
  inStockShelves,
  lowStockShelves,
  queueLength,
  onNavigate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* 1. Total Shelves Card */}
      <div
        onClick={() => onNavigate('dashboard')}
        className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Box className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Shelves</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{totalShelves}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Monitoring</span>
          <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 2. In Stock Card */}
      <div
        onClick={() => onNavigate('inventory')}
        className="bg-white rounded-2xl p-5 border border-emerald-100/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <CheckCircle className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Stock</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{inStockShelves}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Shelves</span>
          <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 3. Low Stock Card */}
      <div
        onClick={() => onNavigate('alerts')}
        className="bg-white rounded-2xl p-5 border border-red-100/90 shadow-xs hover:shadow-md hover:border-red-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-500/20 group-hover:scale-105 transition-transform">
            <AlertTriangle className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{lowStockShelves}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Shelves</span>
          <ArrowRight className="w-4 h-4 text-red-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* 4. Queue Length Card */}
      <div
        onClick={() => onNavigate('queue')}
        className="bg-white rounded-2xl p-5 border border-purple-100/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7 stroke-[2]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Queue Length</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-0.5">{queueLength}</div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>Customers</span>
          <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
