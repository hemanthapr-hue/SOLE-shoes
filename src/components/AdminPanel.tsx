import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Plus, Trash2, Package, ShoppingCart, 
  DollarSign, TrendingUp, Calendar, Inbox, ClipboardList, Check, Loader2 
} from 'lucide-react';
import { Product, Order } from '../types';
import { 
  fetchProducts, fetchOrders, addProduct, deleteProduct, loginAdmin 
} from '../apiClient';

interface AdminPanelProps {
  onStateChanged?: () => void; // Trigger catalog update if list modified
}

export default function AdminPanel({ onStateChanged }: AdminPanelProps) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard state
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'inventory' | 'orders'>('inventory');
  const [loadingData, setLoadingData] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Casual');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["8", "9", "10"]);

  // Form notifications
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Load backend stats
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      const liveProducts = await fetchProducts();
      const liveOrders = await fetchOrders();
      setProducts(liveProducts || []);
      setOrders(liveOrders || []);
    } catch (err) {
      console.warn("Failed to update admin parameters:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError('Please fill in both fields');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      const isOk = await loginAdmin(username, password);
      if (isOk) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid credentials. Hint: use admin / admin123');
      }
    } catch (err) {
      setAuthError('Authentication server timed out');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size].sort((a,b) => parseInt(a) - parseInt(b)));
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (!newTitle.trim() || !newBrand.trim() || !newPrice.trim() || !newDescription.trim() || !newImageUrl.trim()) {
      setFormError('Please fill in all product specifications.');
      return;
    }

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid numeric pricing.');
      return;
    }

    if (selectedSizes.length === 0) {
      setFormError('Choose at least one available shoe size.');
      return;
    }

    setFormLoading(true);

    const generatedId = "prod-" + new Date().getTime();
    const productData: Product = {
      id: generatedId,
      title: newTitle.trim(),
      brand: newBrand.trim(),
      price: priceNum,
      category: newCategory,
      description: newDescription.trim(),
      image_url: newImageUrl.trim(),
      sizes: selectedSizes
    };

    try {
      const result = await addProduct(productData);
      if (result.success) {
        setFormSuccess('Shoe item added successfully to the catalog!');
        // Reset form except brand/category
        setNewTitle('');
        setNewPrice('');
        setNewDescription('');
        setNewImageUrl('');
        
        // Re-fetch
        await loadDashboardData();
        if (onStateChanged) onStateChanged();
      } else {
        setFormError(result.error || 'Server rejected product submission');
      }
    } catch (err) {
      setFormError('Failed to synchronize with spreadsheets database');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you absolutely sure you want to remove "${name}" from your footwear database?`)) return;

    setDeletingProductId(id);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        await loadDashboardData();
        if (onStateChanged) onStateChanged();
      } else {
        alert(result.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error connecting with catalog spreadsheet database');
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  // Helper stats values
  const totalRevenue = orders
    .filter(o => o.status === 'Completed' || o.status === 'Shipped')
    .reduce((sum, o) => {
      // Lookup match pricing or fallback to historical shoe pricing
      const pr = products.find(p => p.id === o.shoe_id)?.price || 150;
      return sum + pr;
    }, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  const sizeChecklist = ["5", "6", "7", "8", "9", "10", "11", "12", "13"];

  return (
    <div id="admin-subview" className="w-full min-h-screen bg-[#050505] pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-white">
      
      {/* 1. Secure Access Gateway Overlap */}
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto bg-[#0a0a0c]/90 border border-white/10 rounded-none shadow-2xl overflow-hidden mt-8" id="admin-login-card">
          <div className="bg-black/40 border-b border-white/10 p-6 text-center text-white flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-none bg-black border border-luxury-gold/55 flex items-center justify-center text-luxury-gold mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-display italic text-2xl font-bold tracking-wide text-[#EAEAEA]">Admin Gateway</h3>
            <p className="text-white/40 font-mono text-[9px] uppercase tracking-widest text-[#C5A059]">Sheets Spreadsheet Storage</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-left bg-[#0c0c0f]/50">
            {authError && (
              <div className="p-3 bg-rose-950/40 text-rose-450 border border-rose-900 rounded-none text-xs font-mono" id="login-error-banner">
                ❌ {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                Staff Account Username
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#121216]/60 border border-white/10 focus:border-luxury-gold rounded-none py-3.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition"
                  id="login-username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                Workspace Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full bg-[#121216]/60 border border-white/10 focus:border-luxury-gold rounded-none py-3.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition"
                  id="login-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              id="btn-login-submit"
              className="w-full py-4 bg-luxury-gold hover:brightness-110 disabled:bg-[#151515] text-black font-sans text-xs tracking-widest uppercase font-bold transition rounded-none text-center flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-luxury-gold/5"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Checking Cloud Sheets...</span>
                </>
              ) : (
                <span>Unlock Workspace</span>
              )}
            </button>
            <p className="text-[9px] font-mono tracking-widest text-[#C5A059]/60 text-center cursor-default uppercase pt-1">
              Testing Hint: Use <strong className="text-white">admin / admin123</strong> to bypass.
            </p>
          </form>
        </div>
      ) : (
        /* 2. MAIN ADMINISTRATION WORKSPACE */
        <div className="max-w-7xl mx-auto space-y-8" id="admin-dashboard-container">
          
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-5">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-luxury-gold">STAFF WORKSPACE SECURE</span>
              </div>
              <h2 className="font-display italic text-2xl sm:text-3.5xl font-black text-[#EAEAEA] tracking-tight mt-1">
                Sheets Storefront Administrator
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={loadDashboardData}
                disabled={loadingData}
                id="btn-refresh-dashboard"
                className="py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-none text-[10px] uppercase font-mono tracking-wider text-[#EAEAEA] transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {loadingData ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardList className="w-4 h-4" />}
                <span>Fetch Latest</span>
              </button>

              <button
                onClick={handleLogout}
                id="btn-logout"
                className="py-2.5 px-4 bg-red-950/40 border border-red-900/50 hover:bg-red-950/60 text-red-450 rounded-none text-[10px] uppercase font-mono tracking-wider transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Disconnect Workspace</span>
              </button>
            </div>
          </div>

          {/* Quick Stats KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-metric-cards">
            {/* Total Revenue */}
            <div className="bg-[#0a0a0c]/85 p-6 border border-white/10 rounded-none flex items-center justify-between shadow-lg">
              <div className="text-left space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/30 block">Accrued Dispatch Revenue</span>
                <p className="font-mono text-2xl font-bold text-luxury-gold">${totalRevenue.toFixed(2)}</p>
                <p className="text-[10px] font-mono text-white/40">Excluding Cancelled/Pending dispatches</p>
              </div>
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center text-luxury-gold">
                <DollarSign className="w-5.5 h-5.5" />
              </div>
            </div>

            {/* Total Orders count */}
            <div className="bg-[#0a0a0c]/85 p-6 border border-white/10 rounded-none flex items-center justify-between shadow-lg">
              <div className="text-left space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/30 block">Total Client Orders</span>
                <p className="font-mono text-2xl font-bold text-luxury-gold">{orders.length}</p>
                <p className="text-[10px] font-mono text-white/40">Total requests lodged in Orders sheet</p>
              </div>
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center text-luxury-gold">
                <ShoppingCart className="w-5.5 h-5.5" />
              </div>
            </div>

            {/* Pending count stats */}
            <div className="bg-[#0a0a0c]/85 p-6 border border-white/10 rounded-none flex items-center justify-between shadow-lg">
              <div className="text-left space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/30 block">Pending In Courier queue</span>
                <p className="font-mono text-2xl font-bold text-rose-500">{pendingCount}</p>
                <p className="text-[10px] font-mono text-white/40">Awaiting status mark change</p>
              </div>
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center text-rose-500">
                <Inbox className="w-5.5 h-5.5" />
              </div>
            </div>

            {/* Product count stats */}
            <div className="bg-[#0a0a0c]/85 p-6 border border-white/10 rounded-none flex items-center justify-between shadow-lg">
              <div className="text-left space-y-1.5">
                <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/30 block">Items catalogued</span>
                <p className="font-mono text-2xl font-bold text-luxury-gold">{products.length}</p>
                <p className="text-[10px] font-mono text-white/40">Active shoes in Products tab</p>
              </div>
              <div className="w-11 h-11 rounded-none bg-black border border-white/10 flex items-center justify-center text-luxury-gold">
                <Package className="w-5.5 h-5.5" />
              </div>
            </div>
          </div>

          {/* Operational View Tab Switches */}
          <div className="flex border-b border-white/10 gap-2" id="dashboard-tab-actions">
            <button
              onClick={() => setTab('inventory')}
              className={`py-3 px-6 text-xs font-mono tracking-widest uppercase font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                tab === 'inventory'
                  ? 'border-luxury-gold text-luxury-gold font-bold'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
              id="tab-inventory-switch"
            >
              <Package className="w-4 h-4" />
              <span>Products Inventory Manager</span>
            </button>
            <button
              onClick={() => setTab('orders')}
              className={`py-3 px-6 text-xs font-mono tracking-widest uppercase font-bold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                tab === 'orders'
                  ? 'border-luxury-gold text-luxury-gold font-bold'
                  : 'border-transparent text-white/40 hover:text-white'
              }`}
              id="tab-orders-switch"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Customer Orders Tracker</span>
            </button>
          </div>

          {tab === 'inventory' ? (
            /* ================== INVENTORY VIEW TAB ================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="inventory-manager-workspace">
              
              {/* Product list table */}
              <div className="lg:col-span-8 bg-[#0a0a0c]/80 border border-white/10 rounded-none shadow-xl overflow-hidden">
                <div className="p-5 bg-black/30 border-b border-white/10 flex items-center justify-between">
                  <h3 className="font-display italic text-lg font-bold text-[#EAEAEA]">Current Cataloged Shoes</h3>
                  <span className="text-white/40 font-mono text-xs">Rows: {products.length}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-white/60 border-collapse">
                    <thead className="bg-[#121216] border-b border-white/10 text-white/45 font-mono text-[9px] tracking-widest uppercase">
                      <tr>
                        <th className="py-4 px-4">Picture</th>
                        <th className="py-4 px-4 text-nowrap">Model Name</th>
                        <th className="py-4 px-4">Brand</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Price</th>
                        <th className="py-4 px-1">Sizes</th>
                        <th className="py-4 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-10 text-white/40 font-mono italic">No footwear models currently found. Submit one using the form on the right!</td>
                        </tr>
                      ) : (
                        products.map((p) => (
                          <tr key={p.id} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4">
                              <img 
                                src={p.image_url} 
                                alt={p.title} 
                                className="w-10 h-10 object-cover rounded-none border border-white/10 bg-black"
                                referrerPolicy="no-referrer"
                              />
                            </td>
                            <td className="py-3.5 px-4 font-bold text-[#EAEAEA] max-w-[140px] truncate">{p.title}</td>
                            <td className="py-3.5 px-4 font-medium text-white/80">{p.brand}</td>
                            <td className="py-3.5 px-4">
                              <span className="bg-white/5 text-luxury-gold border border-white/10 rounded-none px-2 py-0.5 font-mono text-[9px] uppercase">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-luxury-gold">${p.price.toFixed(2)}</td>
                            <td className="py-3.5 px-1 max-w-[100px] truncate" title={p.sizes.join(', ')}>
                              <span className="font-mono text-[10.5px] text-white/50">{p.sizes.join(',')}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleDeleteProduct(p.id, p.title)}
                                disabled={deletingProductId === p.id}
                                className="p-1 px-2.5 rounded-none bg-red-950/40 border border-red-900/50 hover:bg-red-950/65 text-red-400 font-mono tracking-widest text-[9px] transition uppercase disabled:opacity-50 cursor-pointer"
                                title="Remove shoe record"
                              >
                                {deletingProductId === p.id ? (
                                  <span>...</span>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <Trash2 className="w-3 h-3" />
                                    <span>Remove</span>
                                  </div>
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Add Footwear Form inside inventory tab */}
              <div className="lg:col-span-4 bg-[#121216]/60 border border-white/10 rounded-none shadow-xl overflow-hidden p-6 flex flex-col justify-between">
                <div>
                  <div className="border-b border-white/10 pb-3 mb-5 flex items-center gap-1.5 text-white/80">
                    <Plus className="w-5 h-5 text-luxury-gold" />
                    <h3 className="font-display italic text-base font-bold text-[#EAEAEA]">Add New Product</h3>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4 font-sans">
                    {formError && <div className="p-3 bg-rose-950/50 text-rose-450 border border-rose-900 rounded-none text-xs font-mono" id="form-error">❌ {formError}</div>}
                    {formSuccess && <div className="p-3 bg-emerald-950/50 text-emerald-400 border border-emerald-900 rounded-none text-xs font-mono flex items-center gap-1.5" id="form-success">
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span>{formSuccess}</span>
                    </div>}

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Shoe Title / Model Name</label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Oxford Cobalt Black"
                        className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold rounded-none p-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:ring-0 transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Brand */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Brand</label>
                        <input
                          type="text"
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          placeholder="e.g. SÕLE Premium"
                          className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold rounded-none p-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:ring-0 transition"
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="350"
                          className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold rounded-none p-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:ring-0 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* Category select dropdown */}
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Category</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold text-white rounded-none p-2.5 text-xs font-mono focus:outline-none transition cursor-pointer"
                        >
                          <option value="Casual" className="bg-black text-[#EAEAEA]">Casual Collection</option>
                          <option value="Formal" className="bg-black text-[#EAEAEA]">Formal Collection</option>
                          <option value="Sport" className="bg-black text-[#EAEAEA]">Sport Collection</option>
                        </select>
                      </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Image Asset URL</label>
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold rounded-none p-2.5 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:ring-0 transition"
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block pb-0.5">Product Description</label>
                      <textarea
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Detail calfskin lining, biomechanics comfort specs..."
                        className="w-full bg-black/40 border border-white/10 focus:border-luxury-gold rounded-none p-2 text-xs font-sans text-white focus:outline-none transition"
                      />
                    </div>

                    {/* Sizing selections checkboxes/chips */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">Available Sizes Checklist</label>
                      <div className="max-h-24 overflow-y-auto border border-white/10 p-2 bg-black/35 grid grid-cols-4 gap-1.5 rounded-none" id="admin-form-sizes-grid">
                        {sizeChecklist.map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleSizeToggle(sz)}
                            className={`py-1 text-[10px] font-mono font-bold border transition cursor-pointer ${
                              selectedSizes.includes(sz)
                                ? 'bg-luxury-gold border-luxury-gold text-black shadow-xs'
                                : 'bg-[#121216]/50 border-white/5 text-white/60 hover:border-luxury-gold/50'
                            }`}
                          >
                            US {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      id="btn-inventory-submit"
                      className="w-full py-4 bg-luxury-gold hover:brightness-110 disabled:bg-[#151515] text-black font-sans text-xs tracking-widest uppercase font-bold transition rounded-none text-center flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                    >
                      {formLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-black" />
                          <span>Pushing to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-black" />
                          <span>Add Footwear Record</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          ) : (
            /* ================== ORDER TRACKING VIEW TAB ================== */
            <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-none shadow-xl overflow-hidden text-left" id="orders-tracker-workspace">
              <div className="p-5 bg-black/30 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-display italic text-lg font-bold text-[#EAEAEA]">Recorded Client Orders</h3>
                  <p className="text-xs text-white/40 font-mono">Showing all entries retrieved from spreadsheet real-time chronological desc.</p>
                </div>
                <span className="text-luxury-gold text-xs bg-white/5 border border-white/10 py-1 px-3.5 rounded-none font-mono">Total Orders: {orders.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/60 border-collapse">
                  <thead className="bg-[#121216] border-b border-white/10 text-white/45 font-mono text-[9px] tracking-widest uppercase">
                    <tr>
                      <th className="py-4 px-4 text-nowrap">Stamp Date</th>
                      <th className="py-4 px-4">Client Buyer</th>
                      <th className="py-4 px-4">Shoe Reference</th>
                      <th className="py-4 px-4">Size</th>
                      <th className="py-4 px-4">Contact info</th>
                      <th className="py-4 px-4">Delivery Dispatch Address</th>
                      <th className="py-4 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-12 text-white/40 font-mono italic">No buyer transactions found in Sheets. Submit orders from storefront catalog!</td>
                      </tr>
                    ) : (
                      orders.map((o, idx) => {
                        // resolve shoe details
                        const targetShoe = products.find(p => p.id === o.shoe_id);
                        const shoeTitle = o.shoe_title || targetShoe?.title || `Shoe Code: ${o.shoe_id}`;
                        const formattedTime = new Date(o.timestamp).toLocaleString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <tr key={idx} className="hover:bg-white/5 transition">
                            <td className="py-3.5 px-4 font-mono text-[10.5px] text-white/40 text-nowrap">{formattedTime}</td>
                            <td className="py-3.5 px-4 font-bold text-[#EAEAEA]">{o.name}</td>
                            <td className="py-3.5 px-4 text-nowrap font-medium text-white/80">{shoeTitle}</td>
                            <td className="py-3.5 px-4 text-center font-mono font-bold text-luxury-gold bg-black/20">US {o.size}</td>
                            <td className="py-3.5 px-4 space-y-0.5">
                              <p className="font-semibold text-[#EAEAEA] font-mono">{o.phone}</p>
                              <p className="text-white/40 text-[10.5px] font-mono lowercase">{o.email}</p>
                            </td>
                            <td className="py-3.5 px-4 max-w-[200px]" title={o.address}>
                              <p className="line-clamp-2 leading-relaxed text-white/60 font-light truncate">{o.address}</p>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-flex items-center rounded-none px-2.5 py-0.5 text-[8.5px] font-mono font-bold uppercase tracking-wider ${
                                o.status === 'Completed'
                                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                                  : o.status === 'Shipped'
                                  ? 'bg-blue-950/70 text-blue-400 border border-blue-850/60'
                                  : o.status === 'Cancelled'
                                  ? 'bg-rose-950/70 text-rose-400 border border-rose-850/60'
                                  : 'bg-amber-950/70 text-amber-500 border border-amber-850/60' // Pending
                              }`} id={`order-status-badge-${idx}`}>
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
