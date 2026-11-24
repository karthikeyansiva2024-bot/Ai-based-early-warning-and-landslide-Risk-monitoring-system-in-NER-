import React from 'react';
import {
  X,
  Radio,
  Play,
  Square,
  RefreshCw,
  ShoppingBag,
  UserPlus,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface SimulationControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulating: boolean;
  onToggleAutoSim: () => void;
  onSimulatePurchase: () => void;
  onSimulateRestock: () => void;
  onSimulateCustomerArrival: () => void;
  onSimulateCustomerServe: () => void;
  onResetDefaults: () => void;
}

export const SimulationControlModal: React.FC<SimulationControlModalProps> = ({
  isOpen,
  onClose,
  isSimulating,
  onToggleAutoSim,
  onSimulatePurchase,
  onSimulateRestock,
  onSimulateCustomerArrival,
  onSimulateCustomerServe,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Edge AI & Sensor Simulator</h3>
              <p className="text-xs text-slate-500">Simulate retail shelf edge cameras, weight sensors & queue events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Note on simulation */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">DEMO / SIMULATED DATA NOTICE:</span>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Physical edge IoT sensors and camera nodes are in software simulation mode. All stock depletion,
                automated low-stock alarms, and FIFO queue updates trigger in real time through the simulated service layer.
              </p>
            </div>
          </div>

          {/* Automated Ticker Toggle */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900">Continuous Edge Sensor Simulation</div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically triggers random customer purchases, restocks, and queue checkouts every 5 seconds.
              </p>
            </div>
            <button
              onClick={onToggleAutoSim}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isSimulating
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 hover:bg-rose-700'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700'
              }`}
            >
              {isSimulating ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Simulator</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Auto Sim</span>
                </>
              )}
            </button>
          </div>

          {/* Manual Event Trigger Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Manual Edge Event Triggers
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onSimulatePurchase}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left hover:border-blue-400 transition-all group"
              >
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Item Picked / Sold</span>
                </div>
                <p className="text-[11px] text-slate-500">Decrements stock on Shelf 1 or 4 to test low-stock alert</p>
              </button>

              <button
                onClick={onSimulateRestock}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left hover:border-emerald-400 transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
                  <RefreshCw className="w-4 h-4" />
                  <span>Warehouse Restock</span>
                </div>
                <p className="text-[11px] text-slate-500">Adds 15 items to low-stock shelves & updates percentages</p>
              </button>

              <button
                onClick={onSimulateCustomerArrival}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left hover:border-purple-400 transition-all group"
              >
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs mb-1">
                  <UserPlus className="w-4 h-4" />
                  <span>Customer Joins Queue</span>
                </div>
                <p className="text-[11px] text-slate-500">Appends customer with cart items into FIFO checkout queue</p>
              </button>

              <button
                onClick={onSimulateCustomerServe}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left hover:border-blue-400 transition-all group"
              >
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Customer Served</span>
                </div>
                <p className="text-[11px] text-slate-500">Processes checkout completion & shifts FIFO positions</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onResetDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store Data</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
