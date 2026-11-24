import React, { useState, useEffect } from 'react';
import { Search, Bell, Sliders, CheckCircle2, AlertTriangle, Info, Clock, ChevronDown } from 'lucide-react';
import { type RetailAlert } from '../services/storeService';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alerts: RetailAlert[];
  unreadAlertCount: number;
  onOpenAlerts: () => void;
  onOpenSimulationModal: () => void;
  isSimulating: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  searchQuery,
  onSearchChange,
  alerts,
  unreadAlertCount,
  onOpenAlerts,
  onOpenSimulationModal,
  isSimulating,
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDateStr(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="relative w-96 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search inventory, shelves, customers..."
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200/60 rounded-full w-5 h-5 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        {/* Sensor Simulation Control Trigger */}
        <button
          onClick={onOpenSimulationModal}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSimulating
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          title="Open Edge Sensor Simulator Console"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Sensor Sim: {isSimulating ? 'Active' : 'Configure'}</span>
          <span
            className={`w-2 h-2 rounded-full ${
              isSimulating ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
        </button>

        {/* Live Date/Time pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-xl text-xs text-slate-600 font-medium border border-slate-200/60">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{currentDateStr}</span>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-slate-800">{currentTimeStr}</span>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
                  {unreadAlertCount > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {unreadAlertCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onOpenAlerts();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {alerts.slice(0, 4).map(alert => (
                  <div
                    key={alert.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-50/70 border-red-200/80 text-red-900'
                        : alert.severity === 'WARNING'
                        ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                        : 'bg-blue-50/70 border-blue-200/80 text-blue-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {alert.severity === 'CRITICAL' ? (
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      ) : alert.severity === 'WARNING' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-bold leading-tight">{alert.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{alert.description}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{alert.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              ST
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-bold text-slate-900 leading-tight">Store Team</div>
              <div className="text-xs text-slate-500 font-medium">Admin</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-bold text-slate-800">store.admin@retail.io</p>
              </div>
              <div className="py-1 text-xs text-slate-700">
                <div className="px-4 py-2 flex items-center justify-between text-slate-600">
                  <span>Role</span>
                  <span className="font-semibold text-blue-600">Administrator</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between text-slate-600">
                  <span>Store Node</span>
                  <span className="font-semibold text-slate-800">Main-Outlet #01</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
