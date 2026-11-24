import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDescriptiveStats,
  detectOutliersIQR,
  calculatePearsonCorrelation,
  predictStockDepletion,
  recalculateFIFOQueue,
  type ProductItem,
  type QueueEntry,
} from './retailAnalytics';

test('calculateDescriptiveStats computes accurate mean, median, min, max and stdDev', () => {
  const dataset = [10, 20, 20, 30, 40, 50, 60];
  const stats = calculateDescriptiveStats(dataset);

  assert.equal(stats.count, 7);
  assert.equal(stats.min, 10);
  assert.equal(stats.max, 60);
  assert.equal(stats.median, 30);
  assert.equal(stats.mode, 20);
  assert.equal(stats.mean, 32.86);
  assert.ok(stats.stdDev > 16 && stats.stdDev < 18);
});

test('calculateDescriptiveStats handles empty array gracefully', () => {
  const stats = calculateDescriptiveStats([]);
  assert.equal(stats.count, 0);
  assert.equal(stats.mean, 0);
});

test('detectOutliersIQR correctly identifies statistical anomalies', () => {
  const normalData = [12, 13, 15, 14, 16, 15, 13, 14, 15, 100]; // 100 is outlier
  const result = detectOutliersIQR(normalData);

  assert.ok(result.outliers.includes(100));
  assert.ok(result.upperBound < 100);
});

test('calculatePearsonCorrelation computes standard linear correlation', () => {
  const x = [1, 2, 3, 4, 5];
  const y = [2, 4, 6, 8, 10]; // perfect positive correlation
  const corr = calculatePearsonCorrelation(x, y);
  assert.equal(corr, 1);

  const inverseY = [10, 8, 6, 4, 2];
  const invCorr = calculatePearsonCorrelation(x, inverseY);
  assert.equal(invCorr, -1);
});

test('predictStockDepletion computes days to zero and suggested replenishment batch', () => {
  const lowItem: ProductItem = {
    id: 'prod-1',
    name: 'Potato Chips',
    sku: 'SNK-101',
    category: 'Snacks',
    shelfId: 'shelf-1',
    shelfName: 'Shelf 1',
    currentStock: 8,
    capacity: 60,
    minThreshold: 15,
    price: 3.5,
    dailyConsumptionRate: 4,
    lastRestocked: '2026-11-01',
  };

  const pred = predictStockDepletion(lowItem, 2);
  assert.equal(pred.currentStock, 8);
  assert.equal(pred.estimatedDaysToDepletion, 2);
  assert.equal(pred.stockStatus, 'LOW');
  assert.ok(pred.suggestedRestockQuantity > 0);
});

test('recalculateFIFOQueue maintains strict FIFO order and calculates wait times', () => {
  const entries: QueueEntry[] = [
    {
      id: 'q-1',
      customerName: 'Alice',
      customerId: 'CUST-101',
      itemsCount: 4,
      enteredAt: '10:00 AM',
      status: 'SERVING',
      position: 0,
      estimatedWaitMinutes: 1,
    },
    {
      id: 'q-2',
      customerName: 'Bob',
      customerId: 'CUST-102',
      itemsCount: 12,
      enteredAt: '10:02 AM',
      status: 'WAITING',
      position: 0,
      estimatedWaitMinutes: 0,
    },
    {
      id: 'q-3',
      customerName: 'Charlie',
      customerId: 'CUST-103',
      itemsCount: 6,
      enteredAt: '10:05 AM',
      status: 'WAITING',
      position: 0,
      estimatedWaitMinutes: 0,
    },
  ];

  const processed = recalculateFIFOQueue(entries);
  assert.equal(processed[0].status, 'SERVING');
  assert.equal(processed[0].position, 0);

  assert.equal(processed[1].position, 1);
  assert.ok(processed[1].estimatedWaitMinutes > 0);

  assert.equal(processed[2].position, 2);
  assert.ok(processed[2].estimatedWaitMinutes > processed[1].estimatedWaitMinutes);
});
