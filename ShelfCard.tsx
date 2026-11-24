import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight, Plus, Minus, Layers } from 'lucide-react';
import { type Shelf } from '../services/storeService';

interface ShelfCardProps {
  shelf: Shelf;
  onRestock: (shelfId: string) => void;
  onConsume: (shelfId: string) => void;
  onSelect?: (shelfId: string) => void;
}

export const ShelfCard: React.FC<ShelfCardProps> = ({
  shelf,
  onRestock,
  onConsume,
  onSelect,
}) => {
  const isLow = shelf.stockStatus === 'LOW_STOCK';
  const isMedium = shelf.stockStatus === 'MEDIUM_STOCK';

  // Bar colors
  const barColor = isLow ? 'bg-red-500' : isMedium ? 'bg-amber-500' : 'bg-emerald-500';
  const badgeBg = isLow
    ? 'bg-red-50 text-red-600 border border-red-200'
    : isMedium
    ? 'bg-amber-50 text-amber-600 border border-amber-200'
    : 'bg-emerald-50 text-emerald-600 border border-emerald-200';

  const statusText = isLow ? 'Low Stock' : isMedium ? 'Medium Stock' : 'Stock OK';
  const levelText = isLow ? 'Stock Level: Low' : isMedium ? 'Stock Level: Medium' : 'Stock Level: Good';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="flex gap-4">
        {/* Shelf Image matching reference layout */}
        <div className="w-24 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 relative">
          <img
            src={shelf.imageUrl}
            alt={shelf.shelfNumber}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-[10px] text-white px-1.5 py-0.5 rounded font-mono">
            {shelf.stockPercentage}%
          </span>
        </div>

        {/* Shelf Information */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                <span>{shelf.shelfNumber}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </h3>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">{shelf.assignedProductName}</p>

            {/* Stock status pill matching screenshot */}
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeBg}`}>
                {isLow ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                )}
                <span>{statusText}</span>
              </span>
            </div>
          </div>

          {/* Current Stock metrics (NO DISTANCE CM) */}
          <div className="mt-3">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                Available Quantity
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {shelf.currentStock}{' '}
                <span className="text-xs font-normal text-slate-400">/ {shelf.maxCapacity}</span>
              </span>
            </div>

            {/* Visual Stock Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${Math.min(100, Math.max(5, shelf.stockPercentage))}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400 font-medium">
              <span>{levelText}</span>
              <span>Updated: {shelf.lastUpdated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Simulation Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onConsume(shelf.id)}
          disabled={shelf.currentStock <= 0}
          className="flex-1 py-1 px-2 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200/80 flex items-center justify-center gap-1 disabled:opacity-50 transition-colors"
          title="Simulate a shopper picking an item from shelf"
        >
          <Minus className="w-3 h-3 text-rose-500" />
          <span>-1 Item</span>
        </button>

        <button
          onClick={() => onRestock(shelf.id)}
          className="flex-1 py-1 px-2 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200/80 flex items-center justify-center gap-1 transition-colors"
          title="Simulate warehouse stock replenishment"
        >
          <Plus className="w-3 h-3 text-blue-600" />
          <span>+15 Restock</span>
        </button>
      </div>
    </div>
  );
};
