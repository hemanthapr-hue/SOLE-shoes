import React, { useState, useEffect } from 'react';
import { ShoppingBag, Shield, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onCategorySelect?: (category: string) => void;
  cartCount: number;
}

export default function Header({ currentView, setView, onCategorySelect, cartCount }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (category: string) => {
    setView('catalogue');
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#050505]/90 backdrop-blur-md border-b border-white/10 shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setView('landing')} 
            id="brand-logo"
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="font-display font-black text-xl sm:text-2xl tracking-[0.25em] text-[#EAEAEA] transition-colors group-hover:text-luxury-gold italic">
              SÕLE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold self-end mb-2 group-hover:scale-125 transition-transform"></span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => { setView('catalogue'); if (onCategorySelect) onCategorySelect('All'); }}
              id="nav-shop-all"
              className={`font-sans text-[11px] tracking-[0.2em] uppercase font-medium hover:text-luxury-gold transition cursor-pointer ${
                currentView === 'catalogue' ? 'text-luxury-gold font-semibold' : 'text-white/60'
              }`}
            >
              Shop All
            </button>
            <button 
              onClick={() => handleNavClick('Casual')}
              id="nav-casual"
              className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium text-white/60 hover:text-luxury-gold transition cursor-pointer"
            >
              Casual
            </button>
            <button 
              onClick={() => handleNavClick('Formal')}
              id="nav-formal"
              className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium text-white/60 hover:text-luxury-gold transition cursor-pointer"
            >
              Formal
            </button>
            <button 
              onClick={() => handleNavClick('Sport')}
              id="nav-sport"
              className="font-sans text-[11px] tracking-[0.2em] uppercase font-medium text-white/60 hover:text-luxury-gold transition cursor-pointer"
            >
              Sport
            </button>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => { setView('catalogue'); if (onCategorySelect) onCategorySelect('All'); }}
              id="action-search"
              className="p-1 text-white/60 hover:text-white transition cursor-pointer"
              title="Search store"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setView('admin')}
              id="btn-admin-gate"
              className={`px-6 py-2 border text-[11px] uppercase tracking-widest transition cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-luxury-gold border-luxury-gold text-black font-semibold'
                  : 'border-white/20 text-[#EAEAEA] hover:bg-white hover:text-black font-medium'
              }`}
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 inline mr-1" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={() => setView('admin')}
              id="btn-admin-mobile-gate"
              className={`p-1.5 rounded-md transition ${
                currentView === 'admin' ? 'text-luxury-gold' : 'text-white/60'
              }`}
              title="Admin Dashboard"
            >
              <Shield className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="btn-mobile-menu"
              className="p-1 text-white/60 hover:text-white transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 px-4 py-6 space-y-4 animate-fade-in text-white">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => { setView('landing'); setMobileMenuOpen(false); }}
              id="nav-mobile-home"
              className="text-left font-display text-sm tracking-widest uppercase font-semibold text-[#EAEAEA] border-b border-white/5 pb-2 cursor-pointer"
            >
              Home
            </button>
            <button 
              onClick={() => { setView('catalogue'); if (onCategorySelect) onCategorySelect('All'); setMobileMenuOpen(false); }}
              id="nav-mobile-shop-all"
              className="text-left font-display text-sm tracking-widest uppercase font-semibold text-[#EAEAEA] border-b border-white/5 pb-2 cursor-pointer"
            >
              Catalogue
            </button>
            <button 
              onClick={() => handleNavClick('Casual')}
              id="nav-mobile-casual"
              className="text-left font-display text-sm tracking-widest uppercase font-medium text-white/60 hover:text-white pb-2 pl-2 pb-2 pl-2"
            >
              Casual Collection
            </button>
            <button 
              onClick={() => handleNavClick('Formal')}
              id="nav-mobile-formal"
              className="text-left font-display text-sm tracking-widest uppercase font-medium text-white/60 hover:text-white pb-2 pl-2"
            >
              Formal Collection
            </button>
            <button 
              onClick={() => handleNavClick('Sport')}
              id="nav-mobile-sport"
              className="text-left font-display text-sm tracking-widest uppercase font-medium text-white/60 hover:text-white pb-2 pl-2"
            >
              Sport Collection
            </button>
            
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button 
                onClick={() => { setView('admin'); setMobileMenuOpen(false); }}
                id="btn-mobile-drawer-admin"
                className="text-xs font-semibold text-white/60 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-4 h-4 text-white/40" />
                Staff Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
