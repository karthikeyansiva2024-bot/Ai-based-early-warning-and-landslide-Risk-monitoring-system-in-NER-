/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { SimulationControlModal } from './components/SimulationControlModal';
import { DashboardView } from './pages/DashboardView';
import { InventoryView } from './pages/InventoryView';
import { QueueView } from './pages/QueueView';
import { AlertsView } from './pages/AlertsView';
import { ReportsAnalyticsView } from './pages/ReportsAnalyticsView';
import { SettingsArchitectureView } from './pages/SettingsArchitectureView';
import { storeService } from './services/storeService';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSimModalOpen, setIsSimModalOpen] = useState(false);

  // Force re-render on reactive store changes
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = storeService.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsubscribe;
  }, []);

  const kpis = storeService.getKPIs();
  const shelves = storeService.getShelves();
  const products = storeService.getProducts();
  const queue = storeService.getQueue();
  const alerts = storeService.getAlerts();
  const unreadAlertCount = storeService.getUnreadAlertCount();
  const stockHistory = storeService.getStockHistory();
  const queueHistory = storeService.getQueueHistory();
  const isSimulating = storeService.isSimulatorActive();
  const servedTodayCount = storeService.getServedTodayCount();
  const predictions = storeService.getAIPredictions();

  // Handlers
  const handleRestock = (shelfId: string, qty: number = 15) => {
    storeService.restockShelf(shelfId, qty);
  };

  const handleConsume = (shelfId: string, qty: number = 1) => {
    storeService.consumeShelfItem(shelfId, qty);
  };

  const handleServeCustomer = () => {
    storeService.serveNextCustomer();
  };

  const handleAddCustomer = (name?: string, items?: number) => {
    storeService.addCustomerToQueue(name, items);
  };

  const handleCompleteCustomer = (id?: string) => {
    storeService.completeServedCustomer(id);
  };

  const handleRemoveCustomer = (id: string) => {
    storeService.removeCustomer(id);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FC] text-slate-800 flex flex-col md:flex-row antialiased">
      {/* Dark Navy Sidebar matching reference */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={tab => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadAlertCount={unreadAlertCount}
        lastUpdated={kpis.lastUpdated}
        isSimulating={isSimulating}
        onToggleSim={() => storeService.toggleAutoSimulation()}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alerts={alerts}
          unreadAlertCount={unreadAlertCount}
          onOpenAlerts={() => setActiveTab('alerts')}
          onOpenSimulationModal={() => setIsSimModalOpen(true)}
          isSimulating={isSimulating}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              kpis={kpis}
              shelves={shelves}
              queue={queue}
              alerts={alerts}
              stockHistory={stockHistory}
              onNavigate={setActiveTab}
              onRestock={id => handleRestock(id, 15)}
              onConsume={id => handleConsume(id, 1)}
              onServeCustomer={handleServeCustomer}
              onAddCustomer={() => handleAddCustomer()}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              products={products}
              shelves={shelves}
              onAddProduct={prod => storeService.addProduct(prod)}
              onUpdateProduct={(id, upd) => storeService.updateProduct(id, upd)}
              onDeleteProduct={id => storeService.deleteProduct(id)}
              onRestockShelf={(id, qty) => handleRestock(id, qty)}
              onConsumeItem={(id, qty) => handleConsume(id, qty)}
              onExportCSV={() => storeService.exportCSV('inventory')}
            />
          )}

          {activeTab === 'queue' && (
            <QueueView
              queue={queue}
              queueHistory={queueHistory}
              servedTodayCount={servedTodayCount}
              onAddCustomer={(name, items) => handleAddCustomer(name, items)}
              onServeNext={handleServeCustomer}
              onCompleteCustomer={handleCompleteCustomer}
              onRemoveCustomer={handleRemoveCustomer}
              onExportCSV={() => storeService.exportCSV('queue')}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              onMarkRead={id => storeService.markAlertRead(id)}
              onMarkAllRead={() => storeService.markAllAlertsRead()}
              onResolve={id => storeService.resolveAlert(id)}
              onClearResolved={() => storeService.clearResolvedAlerts()}
              onExportCSV={() => storeService.exportCSV('alerts')}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsAnalyticsView
              products={products}
              shelves={shelves}
              queueHistory={queueHistory}
              predictions={predictions}
              onExportCSV={type => storeService.exportCSV(type)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsArchitectureView
              isSimulating={isSimulating}
              onToggleSim={() => storeService.toggleAutoSimulation()}
              onResetDefaults={() => storeService.resetToDefaults()}
            />
          )}
        </main>
      </div>

      {/* Edge Sensor Simulator Modal */}
      <SimulationControlModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        isSimulating={isSimulating}
        onToggleAutoSim={() => storeService.toggleAutoSimulation()}
        onSimulatePurchase={() => storeService.consumeShelfItem('shelf-1', 1)}
        onSimulateRestock={() => storeService.restockShelf('shelf-1', 15)}
        onSimulateCustomerArrival={() => storeService.addCustomerToQueue()}
        onSimulateCustomerServe={() => storeService.completeServedCustomer()}
        onResetDefaults={() => storeService.resetToDefaults()}
      />
    </div>
  );
}
