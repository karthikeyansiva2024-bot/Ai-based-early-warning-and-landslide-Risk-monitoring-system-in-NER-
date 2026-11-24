import React, { useState } from 'react';
import {
  Settings,
  Server,
  Database,
  Code2,
  Terminal,
  Cpu,
  Layers,
  CheckCircle2,
  Sliders,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Radio,
} from 'lucide-react';

interface SettingsArchitectureViewProps {
  isSimulating: boolean;
  onToggleSim: () => void;
  onResetDefaults: () => void;
}

export const SettingsArchitectureView: React.FC<SettingsArchitectureViewProps> = ({
  isSimulating,
  onToggleSim,
  onResetDefaults,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'springboot' | 'mysql' | 'python'>('springboot');
  const [notificationSound, setNotificationSound] = useState(true);
  const [autoRestockThreshold, setAutoRestockThreshold] = useState(20);
  const [sensorSensitivity, setSensorSensitivity] = useState('High (100ms camera poll)');

  const springBootSnippet = `// Spring Boot REST Controller (Java 17 / Spring Data JPA)
package com.smartretail.controller;

@RestController
@RequestMapping("/api/v1/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping("/shelves")
    public ResponseEntity<List<ShelfDTO>> getAllShelves() {
        return ResponseEntity.ok(inventoryService.fetchActiveEdgeShelves());
    }

    @PostMapping("/edge-ping")
    public ResponseEntity<SensorAck> receiveEdgeCameraPing(@RequestBody EdgeReading payload) {
        // Real-time stock update without distance sensor
        return ResponseEntity.ok(inventoryService.processStockUpdate(payload));
    }
}`;

  const mysqlSnippet = `-- MySQL 8.0 Relational Table DDL
CREATE TABLE shelves (
    id VARCHAR(36) PRIMARY KEY,
    shelf_number VARCHAR(20) NOT NULL UNIQUE,
    section_code VARCHAR(20) NOT NULL,
    max_capacity INT NOT NULL DEFAULT 60,
    current_stock INT NOT NULL DEFAULT 0,
    stock_status ENUM('STOCK_OK', 'MEDIUM_STOCK', 'LOW_STOCK', 'EMPTY'),
    stock_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((current_stock / max_capacity) * 100) STORED,
    last_sensor_ping TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

  const pythonSnippet = `# Python FastAPI & Pandas EDA Engine
from fastapi import FastAPI
import pandas as pd
from sklearn.linear_model import LinearRegression

@app.post("/api/analytics/eda")
def run_exploratory_data_analysis(data: InventoryPayload):
    df = pd.DataFrame(data.products)
    stats = df[['currentStock', 'price']].describe().to_dict()
    q1 = df['currentStock'].quantile(0.25)
    q3 = df['currentStock'].quantile(0.75)
    iqr = q3 - q1
    outliers = df[(df['currentStock'] < q1 - 1.5*iqr) | (df['currentStock'] > q3 + 1.5*iqr)]
    return {"descriptive_stats": stats, "outlier_count": len(outliers)}`;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center shadow-sm">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">System Configuration &amp; Architecture</h1>
              <p className="text-xs text-slate-500">
                Java Spring Boot backend, MySQL database schema, Python analytics &amp; edge sensor engine
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Store State</span>
        </button>
      </div>

      {/* System Settings & Node Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Node Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Edge AI &amp; Store Parameters</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Edge Sensor Simulation Mode</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Automated purchase and replenishment events</div>
              </div>
              <button
                onClick={onToggleSim}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSimulating
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isSimulating ? 'SIMULATOR ON' : 'PAUSED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Critical Stock Warning Threshold</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Triggers high priority alerts when shelf reaches this %</div>
              </div>
              <span className="font-bold text-sm text-red-600 px-3 py-1 bg-red-50 rounded-lg border border-red-200">
                20% Capacity
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Queue Cashier Service Speed</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Average checkout handling time per basket</div>
              </div>
              <span className="font-bold text-sm text-purple-700 px-3 py-1 bg-purple-50 rounded-lg border border-purple-200">
                15s / cart item
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">System Audio Alerts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Chime on low stock and queue surge</div>
              </div>
              <input
                type="checkbox"
                checked={notificationSound}
                onChange={e => setNotificationSound(e.target.checked)}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Full-Stack Architecture Pipeline */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Server className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">End-to-End Enterprise Architecture</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <div className="font-bold text-slate-900">React Frontend (UI/UX)</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Recharts visualization, Axios HTTP client, real-time reactive store and sensor simulation interface.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <div className="font-bold text-slate-900">Java Spring Boot 3.x (REST API)</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Spring Data JPA, Hibernate ORM, REST Controllers, FIFO Queue dispatching service and alert listeners.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <div className="font-bold text-slate-900">MySQL 8.0 Relational Database</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  10 relational tables (`products`, `shelves`, `inventory`, `queue_entries`, `alerts`, `inventory_history`).
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div>
                <div className="font-bold text-slate-900">Python Analytics Microservice</div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pandas &amp; NumPy for EDA descriptive statistics, IQR outlier detection, Scikit-learn Linear Regression stockout forecasting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Repository Inspector */}
      <div className="bg-[#0B1528] rounded-3xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Project Source Code Inspector</h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveCodeTab('springboot')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeCodeTab === 'springboot'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Spring Boot Java
            </button>
            <button
              onClick={() => setActiveCodeTab('mysql')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeCodeTab === 'mysql'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              MySQL schema.sql
            </button>
            <button
              onClick={() => setActiveCodeTab('python')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeCodeTab === 'python'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Python EDA &amp; ML
            </button>
          </div>
        </div>

        <div className="mt-4 bg-slate-950 p-4 rounded-2xl border border-slate-900 font-mono text-xs overflow-x-auto text-emerald-400 leading-relaxed">
          <pre>
            {activeCodeTab === 'springboot'
              ? springBootSnippet
              : activeCodeTab === 'mysql'
              ? mysqlSnippet
              : pythonSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
