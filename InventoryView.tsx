import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  ArrowUpDown,
  RefreshCw,
  ShoppingBag,
  DollarSign,
  X,
} from 'lucide-react';
import { type ProductItem } from '../utils/retailAnalytics';
import { type Shelf } from '../services/storeService';

interface InventoryViewProps {
  products: ProductItem[];
  shelves: Shelf[];
  onAddProduct: (prod: Omit<ProductItem, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<ProductItem>) => void;
  onDeleteProduct: (id: string) => void;
  onRestockShelf: (shelfId: string, qty: number) => void;
  onConsumeItem: (shelfId: string, qty: number) => void;
  onExportCSV: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  shelves,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onRestockShelf,
  onConsumeItem,
  onExportCSV,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Snacks & Confectionery',
    shelfId: 'shelf-1',
    currentStock: 30,
    capacity: 60,
    minThreshold: 15,
    price: 3.99,
    dailyConsumptionRate: 4.5,
  });

  const categories = ['ALL', 'Snacks & Confectionery', 'Beverages & Soda', 'Bakery & Bread', 'Dairy & Milk', 'Household Essentials'];

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.shelfName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Snacks & Confectionery',
      shelfId: shelves[0]?.id || 'shelf-1',
      currentStock: 25,
      capacity: 50,
      minThreshold: 12,
      price: 2.99,
      dailyConsumptionRate: 4.0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: ProductItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      shelfId: product.shelfId,
      currentStock: product.currentStock,
      capacity: product.capacity,
      minThreshold: product.minThreshold,
      price: product.price,
      dailyConsumptionRate: product.dailyConsumptionRate,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedShelf = shelves.find(s => s.id === formData.shelfId);
    const shelfName = assignedShelf ? assignedShelf.shelfNumber : 'Unassigned';

    if (editingProduct) {
      onUpdateProduct(editingProduct.id, {
        ...formData,
        shelfName,
      });
    } else {
      onAddProduct({
        ...formData,
        shelfName,
        lastRestocked: new Date().toISOString().slice(0, 10),
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Inventory Management</h1>
              <p className="text-xs text-slate-500">Real-time edge shelf catalog, stock levels, and automated low-stock triggers</p>
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
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search product name, SKU, shelf..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden transition-all"
            />
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span className="px-3 py-1 bg-slate-100 rounded-lg">
              Total Products: <strong className="text-slate-900">{products.length}</strong>
            </span>
            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg border border-red-200/60">
              Low Stock: <strong className="text-red-800">{products.filter(p => p.currentStock <= p.minThreshold).length}</strong>
            </span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Product & SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Shelf Node</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Capacity Status</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Depletion Rate</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No inventory products found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isLow = product.currentStock <= product.minThreshold;
                  const pct = Math.round((product.currentStock / Math.max(1, product.capacity)) * 100);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{product.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{product.sku}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          <Layers className="w-3.5 h-3.5 text-blue-500" />
                          {product.shelfName}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{product.currentStock}</span>
                          <span className="text-slate-400">/ {product.capacity}</span>
                        </div>
                        <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isLow ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-200">
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                            Low Stock ({pct}%)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Stock OK ({pct}%)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {product.dailyConsumptionRate} units/day
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onConsumeItem(product.shelfId, 1)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Simulate 1 item sale / decrement"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                          <button
                            onClick={() => onRestockShelf(product.shelfId, 10)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Quick restock +10 units"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(product.id)}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-base text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  placeholder="e.g. Organic Almond Butter 250g"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shelf Assignment</label>
                  <select
                    value={formData.shelfId}
                    onChange={e => setFormData({ ...formData, shelfId: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden bg-white"
                  >
                    {shelves.map(s => (
                      <option key={s.id} value={s.id}>{s.shelfNumber} ({s.sectionCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.capacity}
                    onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minThreshold}
                    onChange={e => setFormData({ ...formData, minThreshold: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
