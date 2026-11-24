import React from 'react';
import {
  LayoutDashboard,
  Package,
  Users,
  Bell,
  BarChart3,
  Settings,
  ShoppingCart,
  Store,
  Radio,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'inventory' | 'queue' | 'alerts' | 'reports' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadAlertCount: number;
  lastUpdated: string;
  isSimulating: boolean;
  onToggleSim: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadAlertCount,
  lastUpdated,
  isSimulating,
  onToggleSim,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as NavTab, label: 'Inventory', icon: Package },
    { id: 'queue' as NavTab, label: 'Queue Monitoring', icon: Users },
    { id: 'alerts' as NavTab, label: 'Alerts', icon: Bell, badge: unreadAlertCount },
    { id: 'reports' as NavTab, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0A1628] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800/80 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 pb-5 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <ShoppingCart className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">Smart Retail</h1>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Smarter Store, Better Tomorrow</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status & Branding */}
      <div className="p-4 space-y-4">
        {/* Edge Simulator Quick Toggle */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="text-xs font-semibold text-slate-200">Edge AI Sim</span>
            </div>
            <button
              onClick={onToggleSim}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                isSimulating ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isSimulating ? 'ACTIVE' : 'IDLE'}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            {isSimulating ? 'Auto-simulating shelf item removal & customer arrivals' : 'Click to enable live sensor simulation'}
          </p>
        </div>

        {/* System Online Badge */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="absolute w-4 h-4 rounded-full bg-emerald-500/30 animate-ping"></span>
          </div>
          <div>
            <div className="text-xs font-bold text-white">System Online</div>
            <div className="text-[11px] text-slate-400">Last updated: {lastUpdated}</div>
          </div>
        </div>

        {/* Brand Watermark matching screenshot */}
        <div className="pt-2 pb-1 text-center border-t border-slate-800/60">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 text-blue-400 mb-1.5">
            <Store className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-slate-300">Smart Retail</div>
          <p className="text-[10px] text-slate-400 leading-tight">Inventory & Queue Monitoring with IoT</p>
        </div>
      </div>
    </aside>
  );
};
