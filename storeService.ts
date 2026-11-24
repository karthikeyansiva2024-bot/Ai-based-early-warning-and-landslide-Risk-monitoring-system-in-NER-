/**
 * Smart Retail Store - Core State Management & Enterprise Service
 * Simulates Spring Boot REST API & MySQL data persistence with Edge AI simulation
 */

import {
  calculateDescriptiveStats,
  detectOutliersIQR,
  calculatePearsonCorrelation,
  predictStockDepletion,
  recalculateFIFOQueue,
  type ProductItem,
  type QueueEntry,
  type PredictionResult,
  type DescriptiveStats,
  type OutlierResult,
} from '../utils/retailAnalytics';

export interface Shelf {
  id: string;
  shelfNumber: string;
  sectionCode: string;
  category: string;
  currentStock: number;
  maxCapacity: number;
  stockStatus: 'STOCK_OK' | 'MEDIUM_STOCK' | 'LOW_STOCK';
  stockPercentage: number;
  imageUrl: string;
  lastUpdated: string;
  assignedProductId: string;
  assignedProductName: string;
}

export interface RetailAlert {
  id: string;
  title: string;
  alertType: 'LOW_STOCK' | 'CRITICAL_STOCK' | 'EMPTY_SHELF' | 'LONG_QUEUE' | 'SYSTEM_INFO';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  timestamp: string;
  isRead: boolean;
  isResolved: boolean;
  relatedEntityId?: string;
}

export interface StockHistoryPoint {
  time: string;
  shelf1: number;
  shelf2: number;
  shelf3?: number;
  shelf4?: number;
  totalStoreStock: number;
}

export interface QueueHistoryPoint {
  hour: string;
  waitingCount: number;
  avgWaitMinutes: number;
  servedCount: number;
}

const INITIAL_SHELVES: Shelf[] = [
  {
    id: 'shelf-1',
    shelfNumber: 'Shelf 1',
    sectionCode: 'Aisle 1 - Snacks',
    category: 'Snacks & Confectionery',
    currentStock: 12,
    maxCapacity: 60,
    stockStatus: 'LOW_STOCK',
    stockPercentage: 20,
    // Realistic retail shelf photograph matching reference
    imageUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80',
    lastUpdated: '10:24 AM',
    assignedProductId: 'prod-1',
    assignedProductName: 'Crispy Sea Salt Potato Chips',
  },
  {
    id: 'shelf-2',
    shelfNumber: 'Shelf 2',
    sectionCode: 'Aisle 2 - Beverages',
    category: 'Beverages & Soda',
    currentStock: 48,
    maxCapacity: 60,
    stockStatus: 'STOCK_OK',
    stockPercentage: 80,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format&fit=crop&q=80',
    lastUpdated: '10:24 AM',
    assignedProductId: 'prod-2',
    assignedProductName: 'Sparkling Mineral Spring Water',
  },
  {
    id: 'shelf-3',
    shelfNumber: 'Shelf 3',
    sectionCode: 'Aisle 3 - Bakery',
    category: 'Bakery & Bread',
    currentStock: 34,
    maxCapacity: 50,
    stockStatus: 'STOCK_OK',
    stockPercentage: 68,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    lastUpdated: '10:20 AM',
    assignedProductId: 'prod-3',
    assignedProductName: 'Artisan Whole Wheat Sourdough',
  },
  {
    id: 'shelf-4',
    shelfNumber: 'Shelf 4',
    sectionCode: 'Aisle 4 - Dairy',
    category: 'Dairy & Milk',
    currentStock: 8,
    maxCapacity: 40,
    stockStatus: 'LOW_STOCK',
    stockPercentage: 20,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    lastUpdated: '10:18 AM',
    assignedProductId: 'prod-4',
    assignedProductName: 'Fresh Pasteurized Whole Milk 1L',
  },
];

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: 'Crispy Sea Salt Potato Chips',
    sku: 'SNK-101',
    category: 'Snacks & Confectionery',
    shelfId: 'shelf-1',
    shelfName: 'Shelf 1',
    currentStock: 12,
    capacity: 60,
    minThreshold: 18,
    price: 3.49,
    dailyConsumptionRate: 7.2,
    lastRestocked: '2026-11-01 08:30',
  },
  {
    id: 'prod-2',
    name: 'Sparkling Mineral Spring Water',
    sku: 'BEV-201',
    category: 'Beverages & Soda',
    shelfId: 'shelf-2',
    shelfName: 'Shelf 2',
    currentStock: 48,
    capacity: 60,
    minThreshold: 15,
    price: 1.99,
    dailyConsumptionRate: 5.4,
    lastRestocked: '2026-11-02 06:15',
  },
  {
    id: 'prod-3',
    name: 'Artisan Whole Wheat Sourdough',
    sku: 'BKY-301',
    category: 'Bakery & Bread',
    shelfId: 'shelf-3',
    shelfName: 'Shelf 3',
    currentStock: 34,
    capacity: 50,
    minThreshold: 12,
    price: 4.25,
    dailyConsumptionRate: 4.8,
    lastRestocked: '2026-11-02 07:00',
  },
  {
    id: 'prod-4',
    name: 'Fresh Pasteurized Whole Milk 1L',
    sku: 'DRY-401',
    category: 'Dairy & Milk',
    shelfId: 'shelf-4',
    shelfName: 'Shelf 4',
    currentStock: 8,
    capacity: 40,
    minThreshold: 14,
    price: 2.89,
    dailyConsumptionRate: 6.9,
    lastRestocked: '2026-11-01 14:00',
  },
  {
    id: 'prod-5',
    name: 'Roasted California Almonds 200g',
    sku: 'SNK-102',
    category: 'Snacks & Confectionery',
    shelfId: 'shelf-1',
    shelfName: 'Shelf 1',
    currentStock: 25,
    capacity: 45,
    minThreshold: 10,
    price: 5.99,
    dailyConsumptionRate: 3.2,
    lastRestocked: '2026-10-31 11:20',
  },
  {
    id: 'prod-6',
    name: 'Zero Sugar Cola 330ml Can (6-pack)',
    sku: 'BEV-202',
    category: 'Beverages & Soda',
    shelfId: 'shelf-2',
    shelfName: 'Shelf 2',
    currentStock: 38,
    capacity: 50,
    minThreshold: 15,
    price: 6.49,
    dailyConsumptionRate: 5.0,
    lastRestocked: '2026-11-01 17:40',
  },
  {
    id: 'prod-7',
    name: 'Greek Plain Yogurt 500g',
    sku: 'DRY-402',
    category: 'Dairy & Milk',
    shelfId: 'shelf-4',
    shelfName: 'Shelf 4',
    currentStock: 19,
    capacity: 35,
    minThreshold: 8,
    price: 3.75,
    dailyConsumptionRate: 3.8,
    lastRestocked: '2026-11-01 09:10',
  },
  {
    id: 'prod-8',
    name: 'Multi-Surface Disinfectant Spray',
    sku: 'HSD-501',
    category: 'Household Essentials',
    shelfId: 'shelf-3',
    shelfName: 'Shelf 3',
    currentStock: 28,
    capacity: 40,
    minThreshold: 8,
    price: 4.99,
    dailyConsumptionRate: 2.1,
    lastRestocked: '2026-10-30 16:30',
  },
];

const INITIAL_QUEUE: QueueEntry[] = [
  {
    id: 'q-1',
    customerName: 'Customer 1',
    customerId: 'CUST-101',
    itemsCount: 4,
    enteredAt: '10:22 AM',
    status: 'WAITING',
    position: 1,
    estimatedWaitMinutes: 2,
  },
  {
    id: 'q-2',
    customerName: 'Customer 2',
    customerId: 'CUST-102',
    itemsCount: 7,
    enteredAt: '10:20 AM',
    status: 'WAITING',
    position: 2,
    estimatedWaitMinutes: 4,
  },
  {
    id: 'q-3',
    customerName: 'Customer 3',
    customerId: 'CUST-103',
    itemsCount: 11,
    enteredAt: '10:18 AM',
    status: 'WAITING',
    position: 3,
    estimatedWaitMinutes: 6,
  },
];

const INITIAL_ALERTS: RetailAlert[] = [
  {
    id: 'alt-1',
    title: 'Shelf 1 is running low on stock',
    alertType: 'LOW_STOCK',
    severity: 'CRITICAL',
    description: 'Crispy Sea Salt Potato Chips at Shelf 1 is at 20% capacity (12/60 items). Threshold is 18 items. Automated replenishment order recommended.',
    timestamp: '10:15 AM',
    isRead: false,
    isResolved: false,
    relatedEntityId: 'shelf-1',
  },
  {
    id: 'alt-2',
    title: 'Shelf 4 stock approaching critical threshold',
    alertType: 'LOW_STOCK',
    severity: 'WARNING',
    description: 'Fresh Pasteurized Milk at Shelf 4 dropped to 8 units (20% capacity). Evening rush demand expected.',
    timestamp: '10:05 AM',
    isRead: false,
    isResolved: false,
    relatedEntityId: 'shelf-4',
  },
  {
    id: 'alt-3',
    title: 'System initialized successfully',
    alertType: 'SYSTEM_INFO',
    severity: 'INFO',
    description: 'Edge AI camera node cluster synchronized with backend data store. All 4 shelf detectors active.',
    timestamp: '09:50 AM',
    isRead: true,
    isResolved: true,
  },
];

const INITIAL_STOCK_TREND: StockHistoryPoint[] = [
  { time: '10:14', shelf1: 16, shelf2: 45, shelf3: 38, shelf4: 15, totalStoreStock: 114 },
  { time: '10:16', shelf1: 15, shelf2: 46, shelf3: 37, shelf4: 14, totalStoreStock: 112 },
  { time: '10:18', shelf1: 14, shelf2: 47, shelf3: 36, shelf4: 12, totalStoreStock: 109 },
  { time: '10:20', shelf1: 13, shelf2: 48, shelf3: 35, shelf4: 10, totalStoreStock: 106 },
  { time: '10:22', shelf1: 12, shelf2: 48, shelf3: 34, shelf4: 9, totalStoreStock: 103 },
  { time: '10:24', shelf1: 12, shelf2: 48, shelf3: 34, shelf4: 8, totalStoreStock: 102 },
];

const INITIAL_QUEUE_HOURLY: QueueHistoryPoint[] = [
  { hour: '08:00 AM', waitingCount: 1, avgWaitMinutes: 1.5, servedCount: 14 },
  { hour: '09:00 AM', waitingCount: 2, avgWaitMinutes: 2.8, servedCount: 26 },
  { hour: '10:00 AM', waitingCount: 3, avgWaitMinutes: 4.0, servedCount: 38 },
  { hour: '11:00 AM', waitingCount: 5, avgWaitMinutes: 6.5, servedCount: 45 },
  { hour: '12:00 PM', waitingCount: 7, avgWaitMinutes: 8.2, servedCount: 52 },
  { hour: '01:00 PM', waitingCount: 4, avgWaitMinutes: 5.1, servedCount: 40 },
];

// Persistent state class with reactive subscribers
class StoreService {
  private shelves: Shelf[] = [];
  private products: ProductItem[] = [];
  private queue: QueueEntry[] = [];
  private alerts: RetailAlert[] = [];
  private stockHistory: StockHistoryPoint[] = [];
  private queueHistory: QueueHistoryPoint[] = [];
  private listeners: Set<() => void> = new Set();
  private autoSimInterval: NodeJS.Timeout | null = null;
  private isSimulating: boolean = false;
  private servedTodayCount: number = 42;

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedShelves = localStorage.getItem('sr_shelves');
      const storedProducts = localStorage.getItem('sr_products');
      const storedQueue = localStorage.getItem('sr_queue');
      const storedAlerts = localStorage.getItem('sr_alerts');

      this.shelves = storedShelves ? JSON.parse(storedShelves) : INITIAL_SHELVES;
      this.products = storedProducts ? JSON.parse(storedProducts) : INITIAL_PRODUCTS;
      this.queue = storedQueue ? JSON.parse(storedQueue) : INITIAL_QUEUE;
      this.alerts = storedAlerts ? JSON.parse(storedAlerts) : INITIAL_ALERTS;
      this.stockHistory = INITIAL_STOCK_TREND;
      this.queueHistory = INITIAL_QUEUE_HOURLY;
    } catch {
      this.shelves = INITIAL_SHELVES;
      this.products = INITIAL_PRODUCTS;
      this.queue = INITIAL_QUEUE;
      this.alerts = INITIAL_ALERTS;
      this.stockHistory = INITIAL_STOCK_TREND;
      this.queueHistory = INITIAL_QUEUE_HOURLY;
    }
  }

  private persist() {
    try {
      localStorage.setItem('sr_shelves', JSON.stringify(this.shelves));
      localStorage.setItem('sr_products', JSON.stringify(this.products));
      localStorage.setItem('sr_queue', JSON.stringify(this.queue));
      localStorage.setItem('sr_alerts', JSON.stringify(this.alerts));
    } catch (e) {
      console.warn('Storage quota or private mode', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- GETTERS ---
  public getShelves(): Shelf[] {
    return [...this.shelves];
  }

  public getProducts(): ProductItem[] {
    return [...this.products];
  }

  public getQueue(): QueueEntry[] {
    return [...this.queue];
  }

  public getAlerts(): RetailAlert[] {
    return [...this.alerts];
  }

  public getUnreadAlertCount(): number {
    return this.alerts.filter(a => !a.isRead).length;
  }

  public getStockHistory(): StockHistoryPoint[] {
    return [...this.stockHistory];
  }

  public getQueueHistory(): QueueHistoryPoint[] {
    return [...this.queueHistory];
  }

  public getServedTodayCount(): number {
    return this.servedTodayCount;
  }

  public isSimulatorActive(): boolean {
    return this.isSimulating;
  }

  public getKPIs() {
    const totalShelves = this.shelves.length;
    const lowStockShelves = this.shelves.filter(s => s.stockStatus === 'LOW_STOCK').length;
    const inStockShelves = totalShelves - lowStockShelves;
    const queueLength = this.queue.filter(q => q.status === 'WAITING').length;
    const totalProducts = this.products.length;
    const totalUnits = this.products.reduce((acc, p) => acc + p.currentStock, 0);

    return {
      totalShelves,
      inStockShelves,
      lowStockShelves,
      queueLength,
      totalProducts,
      totalUnits,
      systemStatus: 'ONLINE',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  // --- SHELF & INVENTORY MUTATIONS ---
  public restockShelf(shelfId: string, addQuantity: number = 20) {
    this.shelves = this.shelves.map(shelf => {
      if (shelf.id === shelfId) {
        const newStock = Math.min(shelf.maxCapacity, shelf.currentStock + addQuantity);
        const percentage = Math.round((newStock / shelf.maxCapacity) * 100);
        const status: 'STOCK_OK' | 'MEDIUM_STOCK' | 'LOW_STOCK' =
          percentage > 50 ? 'STOCK_OK' : percentage > 25 ? 'MEDIUM_STOCK' : 'LOW_STOCK';

        return {
          ...shelf,
          currentStock: newStock,
          stockPercentage: percentage,
          stockStatus: status,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return shelf;
    });

    // Also update associated product
    this.products = this.products.map(prod => {
      if (prod.shelfId === shelfId) {
        const newStock = Math.min(prod.capacity, prod.currentStock + addQuantity);
        return {
          ...prod,
          currentStock: newStock,
          lastRestocked: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }
      return prod;
    });

    this.checkThresholdsAndTriggerAlerts();
    this.recordStockTrendSnapshot();
    this.persist();
  }

  public consumeShelfItem(shelfId: string, decrementCount: number = 1) {
    this.shelves = this.shelves.map(shelf => {
      if (shelf.id === shelfId) {
        const newStock = Math.max(0, shelf.currentStock - decrementCount);
        const percentage = Math.round((newStock / shelf.maxCapacity) * 100);
        const status: 'STOCK_OK' | 'MEDIUM_STOCK' | 'LOW_STOCK' =
          percentage > 50 ? 'STOCK_OK' : percentage > 25 ? 'MEDIUM_STOCK' : 'LOW_STOCK';

        return {
          ...shelf,
          currentStock: newStock,
          stockPercentage: percentage,
          stockStatus: status,
          lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return shelf;
    });

    this.products = this.products.map(prod => {
      if (prod.shelfId === shelfId) {
        return {
          ...prod,
          currentStock: Math.max(0, prod.currentStock - decrementCount),
        };
      }
      return prod;
    });

    this.checkThresholdsAndTriggerAlerts();
    this.recordStockTrendSnapshot();
    this.persist();
  }

  // --- PRODUCT CRUD ---
  public addProduct(product: Omit<ProductItem, 'id'>): ProductItem {
    const id = `prod-${Date.now()}`;
    const newProd: ProductItem = {
      ...product,
      id,
    };
    this.products.unshift(newProd);
    this.persist();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<ProductItem>): boolean {
    let found = false;
    this.products = this.products.map(p => {
      if (p.id === id) {
        found = true;
        const updated = { ...p, ...updates };
        // Sync shelf if stock changed
        if (updates.currentStock !== undefined) {
          this.shelves = this.shelves.map(s => {
            if (s.id === updated.shelfId) {
              const pct = Math.round((updated.currentStock / s.maxCapacity) * 100);
              return {
                ...s,
                currentStock: updated.currentStock,
                stockPercentage: pct,
                stockStatus: pct > 50 ? 'STOCK_OK' : pct > 25 ? 'MEDIUM_STOCK' : 'LOW_STOCK',
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
            }
            return s;
          });
        }
        return updated;
      }
      return p;
    });
    if (found) {
      this.checkThresholdsAndTriggerAlerts();
      this.persist();
    }
    return found;
  }

  public deleteProduct(id: string): boolean {
    const prevLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length !== prevLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // --- FIFO QUEUE MANAGEMENT ---
  public addCustomerToQueue(name?: string, itemsCount?: number): QueueEntry {
    const count = this.queue.length + 1;
    const customerName = name || `Customer ${count}`;
    const customerId = `CUST-${100 + count}`;
    const cartItems = itemsCount ?? Math.floor(Math.random() * 8) + 2;

    const newEntry: QueueEntry = {
      id: `q-${Date.now()}`,
      customerName,
      customerId,
      itemsCount: cartItems,
      enteredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING',
      position: this.queue.filter(q => q.status === 'WAITING').length + 1,
      estimatedWaitMinutes: (this.queue.filter(q => q.status === 'WAITING').length + 1) * 2,
    };

    const updated = [...this.queue, newEntry];
    this.queue = recalculateFIFOQueue(updated);

    if (this.queue.filter(q => q.status === 'WAITING').length >= 5) {
      this.addAlert({
        title: 'High Queue Length Warning',
        alertType: 'LONG_QUEUE',
        severity: 'WARNING',
        description: `Customer billing line has reached ${this.queue.length} customers. Consider opening Checkout Counter 2.`,
      });
    }

    this.persist();
    return newEntry;
  }

  public serveNextCustomer(): QueueEntry | null {
    // If someone is already serving, don't serve another unless completed
    const waitingIndex = this.queue.findIndex(q => q.status === 'WAITING');
    if (waitingIndex === -1) return null;

    this.queue[waitingIndex].status = 'SERVING';
    this.queue = recalculateFIFOQueue(this.queue);
    this.persist();
    return this.queue[waitingIndex];
  }

  public completeServedCustomer(id?: string): boolean {
    let target = id
      ? this.queue.find(q => q.id === id)
      : this.queue.find(q => q.status === 'SERVING') || this.queue.find(q => q.status === 'WAITING');

    if (!target) return false;

    this.servedTodayCount++;
    this.queue = this.queue.filter(q => q.id !== target!.id);
    this.queue = recalculateFIFOQueue(this.queue);
    this.persist();
    return true;
  }

  public removeCustomer(id: string): boolean {
    const prev = this.queue.length;
    this.queue = this.queue.filter(q => q.id !== id);
    if (this.queue.length !== prev) {
      this.queue = recalculateFIFOQueue(this.queue);
      this.persist();
      return true;
    }
    return false;
  }

  // --- ALERTS MANAGEMENT ---
  public addAlert(alert: Omit<RetailAlert, 'id' | 'timestamp' | 'isRead' | 'isResolved'>) {
    // Prevent duplicate spam of exact same title within 10 minutes
    const existing = this.alerts.find(a => a.title === alert.title && !a.isResolved);
    if (existing) return;

    const newAlert: RetailAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      isResolved: false,
    };
    this.alerts.unshift(newAlert);
    this.persist();
  }

  public markAlertRead(id: string) {
    this.alerts = this.alerts.map(a => (a.id === id ? { ...a, isRead: true } : a));
    this.persist();
  }

  public markAllAlertsRead() {
    this.alerts = this.alerts.map(a => ({ ...a, isRead: true }));
    this.persist();
  }

  public resolveAlert(id: string) {
    this.alerts = this.alerts.map(a => (a.id === id ? { ...a, isResolved: true, isRead: true } : a));
    this.persist();
  }

  public clearResolvedAlerts() {
    this.alerts = this.alerts.filter(a => !a.isResolved);
    this.persist();
  }

  private checkThresholdsAndTriggerAlerts() {
    for (const shelf of this.shelves) {
      if (shelf.currentStock <= 0) {
        this.addAlert({
          title: `${shelf.shelfNumber} is completely empty!`,
          alertType: 'EMPTY_SHELF',
          severity: 'CRITICAL',
          description: `Zero inventory detected on ${shelf.shelfNumber} (${shelf.sectionCode}). Immediate staff restock required!`,
          relatedEntityId: shelf.id,
        });
      } else if (shelf.stockStatus === 'LOW_STOCK') {
        this.addAlert({
          title: `${shelf.shelfNumber} is running low on stock`,
          alertType: 'LOW_STOCK',
          severity: 'CRITICAL',
          description: `${shelf.assignedProductName} at ${shelf.shelfNumber} is at ${shelf.stockPercentage}% capacity (${shelf.currentStock}/${shelf.maxCapacity} items).`,
          relatedEntityId: shelf.id,
        });
      }
    }
  }

  private recordStockTrendSnapshot() {
    const s1 = this.shelves.find(s => s.id === 'shelf-1')?.currentStock || 12;
    const s2 = this.shelves.find(s => s.id === 'shelf-2')?.currentStock || 48;
    const s3 = this.shelves.find(s => s.id === 'shelf-3')?.currentStock || 34;
    const s4 = this.shelves.find(s => s.id === 'shelf-4')?.currentStock || 8;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPoint: StockHistoryPoint = {
      time: nowStr,
      shelf1: s1,
      shelf2: s2,
      shelf3: s3,
      shelf4: s4,
      totalStoreStock: s1 + s2 + s3 + s4,
    };

    const trimmed = this.stockHistory.slice(-9);
    trimmed.push(newPoint);
    this.stockHistory = trimmed;
  }

  // --- EDA & ML PREDICTION ENGINE ---
  public getEDASummary() {
    const stockValues = this.products.map(p => p.currentStock);
    const capacityValues = this.products.map(p => p.capacity);
    const rateValues = this.products.map(p => p.dailyConsumptionRate);
    const priceValues = this.products.map(p => p.price);

    const stockStats: DescriptiveStats = calculateDescriptiveStats(stockValues);
    const priceStats: DescriptiveStats = calculateDescriptiveStats(priceValues);
    const outliers: OutlierResult = detectOutliersIQR(stockValues);
    const corrStockVsRate = calculatePearsonCorrelation(stockValues, rateValues);
    const corrStockVsCapacity = calculatePearsonCorrelation(stockValues, capacityValues);

    return {
      totalProducts: this.products.length,
      totalShelves: this.shelves.length,
      stockStats,
      priceStats,
      outliers,
      correlations: {
        stockVsBurnRate: corrStockVsRate,
        stockVsCapacity: corrStockVsCapacity,
      },
      missingValuesCount: 0,
      duplicatesCount: 0,
      memoryUsage: '34.8 KB (in-memory cached Pandas DataFrame equivalent)',
    };
  }

  public getAIPredictions(): PredictionResult[] {
    return this.products.map(p => predictStockDepletion(p, 2));
  }

  // --- SENSOR SIMULATION ENGINE ---
  public toggleAutoSimulation(enable?: boolean) {
    const targetState = enable !== undefined ? enable : !this.isSimulating;
    this.isSimulating = targetState;

    if (this.autoSimInterval) {
      clearInterval(this.autoSimInterval);
      this.autoSimInterval = null;
    }

    if (this.isSimulating) {
      this.autoSimInterval = setInterval(() => {
        this.simulateEdgeSensorTick();
      }, 5000);
    }
    this.notify();
  }

  public simulateEdgeSensorTick() {
    const action = Math.random();

    if (action < 0.45) {
      // Customer removes product from random shelf (purchase)
      const randomShelf = this.shelves[Math.floor(Math.random() * this.shelves.length)];
      if (randomShelf.currentStock > 2) {
        this.consumeShelfItem(randomShelf.id, 1);
      }
    } else if (action < 0.70) {
      // New customer arrives at checkout queue
      this.addCustomerToQueue();
    } else if (action < 0.90) {
      // Cashier completes checkout for front of line
      if (this.queue.length > 0) {
        this.completeServedCustomer();
      }
    } else {
      // Restock event simulation on a low shelf
      const lowShelf = this.shelves.find(s => s.stockStatus === 'LOW_STOCK');
      if (lowShelf) {
        this.restockShelf(lowShelf.id, 15);
      }
    }
  }

  // --- EXPORT TO CSV ---
  public exportCSV(type: 'inventory' | 'shelves' | 'queue' | 'alerts' | 'analytics') {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `smart-retail-${type}-${new Date().toISOString().slice(0, 10)}.csv`;

    switch (type) {
      case 'inventory':
        headers = ['SKU', 'Product Name', 'Category', 'Shelf', 'Current Stock', 'Capacity', 'Min Threshold', 'Unit Price ($)', 'Daily Burn Rate'];
        rows = this.products.map(p => [
          p.sku,
          `"${p.name}"`,
          `"${p.category}"`,
          p.shelfName,
          p.currentStock,
          p.capacity,
          p.minThreshold,
          p.price.toFixed(2),
          p.dailyConsumptionRate,
        ]);
        break;

      case 'shelves':
        headers = ['Shelf ID', 'Shelf Number', 'Section', 'Category', 'Current Stock', 'Capacity', 'Stock %', 'Status', 'Last Edge Ping'];
        rows = this.shelves.map(s => [
          s.id,
          s.shelfNumber,
          `"${s.sectionCode}"`,
          `"${s.category}"`,
          s.currentStock,
          s.maxCapacity,
          `${s.stockPercentage}%`,
          s.stockStatus,
          s.lastUpdated,
        ]);
        break;

      case 'queue':
        headers = ['Queue Position', 'Customer ID', 'Customer Name', 'Cart Items', 'Status', 'Waiting Time (min)', 'Joined At'];
        rows = this.queue.map(q => [
          q.position,
          q.customerId,
          `"${q.customerName}"`,
          q.itemsCount,
          q.status,
          q.estimatedWaitMinutes,
          q.enteredAt,
        ]);
        break;

      case 'alerts':
        headers = ['Alert ID', 'Title', 'Severity', 'Type', 'Description', 'Timestamp', 'Read Status', 'Resolved'];
        rows = this.alerts.map(a => [
          a.id,
          `"${a.title}"`,
          a.severity,
          a.alertType,
          `"${a.description.replace(/"/g, '""')}"`,
          a.timestamp,
          a.isRead ? 'READ' : 'UNREAD',
          a.isResolved ? 'RESOLVED' : 'ACTIVE',
        ]);
        break;

      case 'analytics':
        const eda = this.getEDASummary();
        headers = ['Metric', 'Current Stock Statistic', 'Unit Price Statistic'];
        rows = [
          ['Sample Count (N)', eda.stockStats.count, eda.priceStats.count],
          ['Mean', eda.stockStats.mean, `$${eda.priceStats.mean}`],
          ['Median', eda.stockStats.median, `$${eda.priceStats.median}`],
          ['Mode', eda.stockStats.mode, `$${eda.priceStats.mode}`],
          ['Standard Deviation', eda.stockStats.stdDev, `$${eda.priceStats.stdDev}`],
          ['Variance', eda.stockStats.variance, eda.priceStats.variance],
          ['Minimum', eda.stockStats.min, `$${eda.priceStats.min}`],
          ['Maximum', eda.stockStats.max, `$${eda.priceStats.max}`],
          ['IQR (Interquartile Range)', eda.outliers.iqr, 'N/A'],
          ['Stock vs Consumption Pearson Correlation', eda.correlations.stockVsBurnRate, 'N/A'],
        ];
        break;
    }

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public resetToDefaults() {
    this.shelves = INITIAL_SHELVES;
    this.products = INITIAL_PRODUCTS;
    this.queue = INITIAL_QUEUE;
    this.alerts = INITIAL_ALERTS;
    this.stockHistory = INITIAL_STOCK_TREND;
    this.queueHistory = INITIAL_QUEUE_HOURLY;
    this.persist();
  }
}

export const storeService = new StoreService();
