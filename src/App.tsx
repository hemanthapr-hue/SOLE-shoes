import React, { useState, useEffect } from 'react';
import { 
  fetchProducts, 
  fetchOrders 
} from './apiClient';
import { Product, ViewState } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import AdminPanel from './components/AdminPanel';
import BannerNotice from './components/BannerNotice';
import { 
  Filter, Search, Grid, RefreshCw, Sparkles, SlidersHorizontal, ChevronRight, X 
} from 'lucide-react';

export default function App() {
  // Views navigation
  const [view, setView] = useState<ViewState>('landing');
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('latest');

  // Interaction Modals State
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutSize, setCheckoutSize] = useState<string>('');

  // Initial products retrieval
  const loadStoreProducts = async () => {
    setLoading(true);
    try {
      const items = await loadAndFormatProducts();
      setProducts(items);
    } catch (e) {
      console.error("Retrieval of database shoes failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadAndFormatProducts = async (): Promise<Product[]> => {
    const list = await fetchProducts();
    // Validate sizes format
    return list.map(item => ({
      ...item,
      // Fallback fallback if sizes is loaded as string or undefined
      sizes: Array.isArray(item.sizes) 
        ? item.sizes 
        : (item.sizes ? (item.sizes as string).split(',').map((s: string) => s.trim()) : ["8", "9", "10"])
    }));
  };

  useEffect(() => {
    loadStoreProducts();
  }, []);

  // Filter Categories Select Helper
  const handleSelectCategoryFromHero = (category: string) => {
    setSelectedCategory(category);
    // Reset secondary filters to prevent dead-lookup
    setSelectedBrand('All');
    setSelectedSize('All');
    setSearchQuery('');
  };

  // Derive unique brands from available catalog list
  const uniqueBrands = ['All', ...newValueSet(products.map(p => p.brand))];

  function newValueSet(arr: string[]): string[] {
    const unique: string[] = [];
    arr.forEach(i => {
      if (i && !unique.includes(i)) unique.push(i);
    });
    return unique;
  }

  // Sizing criteria checklist
  const allSizes = ['All', "6", "7", "8", "9", "10", "11", "12"];

  // Filter & Sort math
  const filteredProducts = products.filter(p => {
    // 1. Search Query Match
    const matchesSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Match
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();

    // 3. Brand Match
    const matchesBrand = selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();

    // 4. Size Selection Match
    const matchesSize = selectedSize === 'All' || p.sizes.includes(selectedSize);

    return matchesSearch && matchesCategory && matchesBrand && matchesSize;
  });

  // Sorting list logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'latest':
      default:
        // Assume later ID or index means newer release
        return b.id.localeCompare(a.id);
    }
  });

  // Reset Filters Helper
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedSize('All');
    setSearchQuery('');
    setSortBy('latest');
  };

  // Opening direct Checkout Modal from View Details Modal
  const handleProceedToCheckout = (product: Product, size: string) => {
    setSelectedProductDetails(null); // Close detail modal
    setCheckoutSize(size);
    setCheckoutProduct(product);     // Open checkout modal
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#EAEAEA] font-sans flex flex-col justify-between" id="root-layout">
      
      {/* Top persistent database integration bar */}
      <BannerNotice />

      {/* Navigation Header bar components */}
      <Header 
        currentView={view} 
        setView={setView} 
        onCategorySelect={handleSelectCategoryFromHero}
        cartCount={0}
      />

      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <div className="space-y-0 bg-[#050505]" id="landing-view-container">
            <Hero 
              setView={setView} 
              onSelectCategory={handleSelectCategoryFromHero} 
            />
            
            {/* Featured Dynamic Arrivals Grid on Homepage (Showing Top 4) */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050505]" id="featured-latest-arrivals">
              <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="text-left space-y-1">
                    <p className="text-[10px] tracking-[0.25em] font-bold text-luxury-gold uppercase font-mono">IN THE SPOTLIGHT</p>
                    <h3 className="font-display text-2xl sm:text-4xl font-black text-[#EAEAEA] tracking-tight italic">
                      Latest Arrivals <span className="font-medium italic text-luxury-gold font-display">this season.</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => { setView('catalogue'); setSelectedCategory('All'); }}
                    className="group py-3 px-6 rounded-none border border-white/10 hover:bg-white/5 font-sans text-xs tracking-widest uppercase font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <span>View Entire Catalog</span>
                    <ChevronRight className="w-4 h-4 text-luxury-gold group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-white/40 text-xs tracking-wider font-mono">Syncing luxury shoe wardrobe...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-16 text-center text-white/40 border border-white/10 border-dashed rounded-none italic">
                    Our database spreadsheet products list is blank. Open Admin Panel and add your first shoes!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" id="latest-arrivals-grid">
                    {/* Return the latest 4 index items */}
                    {products.slice(0, 4).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onViewDetails={(p) => setSelectedProductDetails(p)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOGUE & FILTER */}
        {view === 'catalogue' && (
          <div className="w-full pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#050505]" id="catalogue-view-container">
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* Luxury Headline */}
              <div className="text-left border-b border-white/10 pb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-luxury-gold" />
                  <span className="text-[9px] tracking-[0.25em] font-mono text-luxury-gold uppercase">SÕLE COMPLETE PORTFOLIO</span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-black text-[#EAEAEA] italic tracking-tight mt-2">
                  Exquisite Footwear Showcase
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-light mt-2.5 leading-relaxed max-w-2xl">
                  Filter by purpose segment, size profile, or custom terms. Hand-sculpted details, responsive soles, and calfskin linings await your footsteps.
                </p>
              </div>

              {/* SÕLE ADVANCED FILTERING HUB */}
              <div className="bg-[#0a0a0c]/80 border border-white/10 rounded-none p-6 space-y-6 shadow-2xl" id="catalogue-filters-panel">
                
                {/* Search Term and Category Selection Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  
                  {/* Category Pill Buttons */}
                  <div className="lg:col-span-8 flex flex-wrap gap-2" id="category-filter-pills">
                    {['All', 'Casual', 'Formal', 'Sport'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`py-2.5 px-4 text-xs font-bold tracking-widest uppercase transition cursor-pointer rounded-none ${
                          selectedCategory === cat
                            ? 'bg-luxury-gold text-black border border-luxury-gold font-bold shadow-md'
                            : 'bg-transparent border border-white/10 text-white/60 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {cat === 'All' ? 'Complete Catalog' : `${cat} Collection`}
                      </button>
                    ))}
                  </div>

                  {/* Search bar Input */}
                  <div className="lg:col-span-4 relative">
                    <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, brand, or specs..."
                      className="w-full bg-[#121216]/60 border border-white/10 focus:border-luxury-gold rounded-none py-3 pl-10 pr-9 text-xs font-mono text-[#EAEAEA] focus:outline-none transition placeholder-white/30"
                      id="search-input-field"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3.5 p-0.5 rounded-full hover:bg-white/10 text-white/45 hover:text-white transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Brand Filter, size filter, sorting selector row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-5 border-t border-white/10">
                  
                  {/* Brand dropdown */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-white/30" />
                      <span>Select Brand Label</span>
                    </label>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full bg-[#121216] border border-white/10 focus:border-luxury-gold text-white rounded-none p-2.5 text-xs font-mono focus:outline-none transition cursor-pointer"
                      id="filter-brand-dropdown"
                    >
                      {uniqueBrands.map((b) => (
                        <option key={b} value={b} className="bg-[#121216] text-[#EAEAEA]">{b === 'All' ? 'All Brands / Manufacturers' : b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Single Size selection chip row */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block">
                      Filter Available Size (US)
                    </label>
                    <div className="flex flex-wrap gap-1.5" id="filter-size-chips">
                      {allSizes.map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`w-8 h-8 rounded-none text-[10px] font-mono tracking-tight transition cursor-pointer border ${
                            selectedSize === sz
                              ? 'bg-luxury-gold border-luxury-gold text-black font-bold shadow-sm'
                              : 'bg-[#121216]/40 border-white/10 text-white/60 hover:border-luxury-gold/50 hover:bg-white/5'
                          }`}
                        >
                          {sz === 'All' ? 'ALL' : sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List Sorting dropdown */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block">
                      Sort Footwear List By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-[#121216] border border-white/10 focus:border-luxury-gold text-white rounded-none p-2.5 text-xs font-mono focus:outline-none transition cursor-pointer"
                      id="sort-product-dropdown"
                    >
                      <option value="latest" className="bg-[#121216] text-[#EAEAEA]">Latest Released Models</option>
                      <option value="price-low" className="bg-[#121216] text-[#EAEAEA]">Pricing: Low to High</option>
                      <option value="price-high" className="bg-[#121216] text-[#EAEAEA]">Pricing: High to Low</option>
                      <option value="title-asc" className="bg-[#121216] text-[#EAEAEA]">Alphabetical (A - Z)</option>
                    </select>
                  </div>

                </div>

                {/* Sub-counter and Reset Filters Button block */}
                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-white/5">
                  <span className="text-white/45 font-mono">
                    Showing <strong className="text-luxury-gold font-bold">{sortedProducts.length}</strong> of {products.length} footwear styles matching criteria
                  </span>
                  {(selectedCategory !== 'All' || selectedBrand !== 'All' || selectedSize !== 'All' || searchQuery !== '') && (
                    <button
                      onClick={handleResetFilters}
                      id="btn-clear-all-filters"
                      className="text-[9px] font-mono tracking-widest font-bold text-luxury-gold hover:text-white uppercase underline cursor-pointer hover:no-underline"
                    >
                      Reset All Filters
                    </button>
                  )}
                </div>

              </div>

              {/* Grid List Products segment */}
              {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-10 h-10 text-luxury-gold animate-spin" />
                  <p className="text-white/40 text-xs tracking-wider font-mono">Updating footwear showroom...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="bg-[#0a0a0c]/80 rounded-none p-16 text-center border border-white/10 space-y-4 max-w-xl mx-auto" id="no-matched-products">
                  <Grid className="w-12 h-12 text-[#C5A059] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-display italic font-bold text-lg text-[#EAEAEA]">No Footwear Matches</h4>
                    <p className="text-white/40 text-xs sm:text-sm font-light">
                      No shoe models fit your exact search combined filters. Switch parameters or click reset.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    id="btn-no-matched-reset-filters"
                    className="py-3 px-6 bg-luxury-gold hover:brightness-110 text-black rounded-none text-xs tracking-widest font-mono font-bold uppercase transition"
                  >
                    Reset Filter Hub
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" id="catalogue-items-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onViewDetails={(p) => setSelectedProductDetails(p)} 
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 3: STAFF ADMINISTRATIVE DASHBOARD */}
        {view === 'admin' && (
          <AdminPanel onStateChanged={loadStoreProducts} />
        )}
      </main>

      {/* FOOTER SECTION SIGNATURE */}
      <footer 
        id="luxury-footer-panel"
        className="w-full bg-zinc-950 text-zinc-500 py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-900/60 transition"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-base tracking-[0.25em] text-white">SÕLE</span>
            <span className="text-[10px] text-zinc-600">| Premium Footwear Co.</span>
          </div>
          
          <div className="text-center sm:text-right space-y-1 text-xs">
            <p className="font-light">
              &copy; {new Date().getFullYear()} SÕLE Footwear. Fine Handcrafted Biomechanical Soles.
            </p>
            <p className="text-zinc-700 text-[10px] select-none cursor-default">
              Powered by Cloud Run & Google Sheets Spreadsheet Real-Time API Execution
            </p>
          </div>
        </div>
      </footer>

      {/* DETAILS VIEW MODAL ELEMENT OVERLAY */}
      {selectedProductDetails && (
        <ProductModal 
          product={selectedProductDetails} 
          onClose={() => setSelectedProductDetails(null)} 
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {/* DISPATCH CHECKOUT REGISTRATION MODAL ELEMENTS */}
      {checkoutProduct && (
        <CheckoutModal 
          product={checkoutProduct} 
          selectedSize={checkoutSize} 
          onClose={() => setCheckoutProduct(null)}
          onOrderCompleted={loadStoreProducts}
        />
      )}

    </div>
  );
}
