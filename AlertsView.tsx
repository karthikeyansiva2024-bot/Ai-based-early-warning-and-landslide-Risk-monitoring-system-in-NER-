import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  Download,
  Filter,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { type RetailAlert } from '../services/storeService';
import { NavTab } from '../components/Sidebar';

interface AlertsViewProps {
  alerts: RetailAlert[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onResolve: (id: string) => void;
  onClearResolved: () => void;
  onExportCSV: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onMarkRead,
  onMarkAllRead,
  onResolve,
  onClearResolved,
  onExportCSV,
  onNavigate,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    const matchesSev = filterSeverity === 'ALL' || a.severity === filterSeverity;
    const matchesStat =
      filterStatus === 'ALL' ||
      (filterStatus === 'UNREAD' && !a.isRead) ||
      (filterStatus === 'ACTIVE' && !a.isResolved) ||
      (filterStatus === 'RESOLVED' && a.isResolved);
    return matchesSev && matchesStat;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">System Alert Management</h1>
              <p className="text-xs text-slate-500">Automated edge inventory thresholds, shelf depletion & queue surge monitoring</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200/80"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-red-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Critical Unresolved</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-3xl font-extrabold text-red-600 mt-2">{criticalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires immediate shelf restock</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Unread Notifications</span>
            <Bell className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{unreadCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Pending operator acknowledgement</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Logged Alerts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{alerts.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Historical sensor event count</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Severity:</span>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(sev => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onClearResolved}
            className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Resolved</span>
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200 text-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="font-bold text-slate-700 text-sm">All clear! No alerts match your filters.</p>
            <p className="mt-1">Edge IoT threshold triggers are monitoring all store shelves.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            const cardBorder = isCritical
              ? 'border-red-200 bg-red-50/40'
              : isWarning
              ? 'border-amber-200 bg-amber-50/40'
              : 'border-blue-200 bg-blue-50/40';

            const badgeColor = isCritical
              ? 'bg-red-500 text-white'
              : isWarning
              ? 'bg-amber-500 text-white'
              : 'bg-blue-500 text-white';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-3xl border ${cardBorder} shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !alert.isRead ? 'ring-2 ring-blue-400/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl ${badgeColor} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
                  >
                    {isCritical ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isWarning ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{alert.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${badgeColor}`}>
                        {alert.severity}
                      </span>
                      {!alert.isRead && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          NEW / UNREAD
                        </span>
                      )}
                      {alert.isResolved && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          RESOLVED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{alert.description}</p>
                    <div className="text-[11px] text-slate-400 font-medium">Logged at {alert.timestamp}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {alert.relatedEntityId && (
                    <button
                      onClick={() => onNavigate('inventory')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <span>Restock Shelf</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!alert.isRead && (
                    <button
                      onClick={() => onMarkRead(alert.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}

                  {!alert.isResolved ? (
                    <button
                      onClick={() => onResolve(alert.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold px-2 py-1">Resolved</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
