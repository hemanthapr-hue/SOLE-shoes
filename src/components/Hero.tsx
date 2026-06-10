import { ArrowRight, Sparkles, Layers, Anchor, Zap } from 'lucide-react';
import { ViewState } from '../types';

interface HeroProps {
  setView: (view: ViewState) => void;
  onSelectCategory: (category: string) => void;
}

export default function Hero({ setView, onSelectCategory }: HeroProps) {
  const handleCategoryClick = (category: string) => {
    onSelectCategory(category);
    setView('catalogue');
  };

  return (
    <div id="hero-curation-view" className="w-full bg-[#050505] text-[#EAEAEA]">
      {/* Cinematic Hero Section */}
      <section 
        id="luxury-hero"
        className="relative w-full min-h-screen bg-[#050505] text-[#EAEAEA] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24 overflow-hidden"
      >
        {/* Ambient Lighting Gradients */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-luxury-gold/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

        {/* Diagonal subtle pattern lines for premium detail */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 mt-10">
          
          {/* Hero Narrative Block */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-luxury-gold animate-pulse" />
              <span className="text-[10px] tracking-widest uppercase font-semibold text-luxury-gold font-mono">AUTUMN COLLECTION 2024 / 2026</span>
            </div>
            
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#EAEAEA] leading-[0.85] italic uppercase select-none" id="hero-heading">
              AESTHETIC<br/>
              <span className="pl-8 sm:pl-12 text-luxury-gold">SUPREMACY.</span>
            </h1>
            
            <p className="font-sans text-sm sm:text-base text-white/50 max-w-sm leading-relaxed font-light mt-4" id="hero-subtext">
              Meticulously crafted leather soles, synchronized in real-time via Google Cloud infrastructure for the modern collector.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8 w-full sm:w-auto">
              <button
                onClick={() => handleCategoryClick('All')}
                id="btn-hero-cta"
                className="py-4 px-8 bg-luxury-gold hover:brightness-110 text-black font-sans text-xs tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
              >
                <span>Shop Latest Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setView('catalogue')}
                id="btn-hero-explore"
                className="py-4 px-8 bg-transparent hover:bg-white/5 border border-white/10 text-white font-sans text-xs tracking-widest uppercase font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
              >
                <span>Explore Tech Stack</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10 w-full max-w-md">
              <div>
                <p className="font-display text-2xl font-black italic text-luxury-gold">0%</p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/40 mt-1">Impact Shock</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black italic text-luxury-gold">100%</p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/40 mt-1">Calfskin Lining</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black italic text-luxury-gold">4.9★</p>
                <p className="font-mono text-[9px] tracking-widest uppercase text-white/40 mt-1">Elite Collector</p>
              </div>
            </div>
          </div>

          {/* Arched Hero Shoe Visual Block */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end z-10">
            <div className="relative">
              <div className="w-80 h-[480px] border border-white/10 rounded-t-full bg-neutral-950 overflow-hidden flex flex-col group shadow-2xl" id="hero-image-wrapper">
                <div className="h-1/2 w-full bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400')] bg-cover bg-center grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"></div>
                <div className="flex-1 p-8 flex flex-col justify-between bg-[#0a0a0d] text-left">
                  <div>
                    <span className="font-mono text-[10px] text-luxury-gold tracking-widest">MODEL_V2.0</span>
                    <h3 className="font-display text-2xl italic font-black text-[#EAEAEA] mt-1">Derby Nero</h3>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-xl font-bold text-[#EAEAEA]">$420.00</span>
                    <div 
                      onClick={() => handleCategoryClick('Casual')}
                      className="text-[10px] text-white/40 underline uppercase cursor-pointer hover:text-luxury-gold"
                    >
                      View Specs
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 glass border border-white/10 p-4 rounded-lg shadow-2xl rotate-6 z-20">
                <div className="text-[9px] font-mono text-white/40 uppercase mb-1">Live Stock</div>
                <div className="text-xl font-display italic text-[#EAEAEA] font-bold">12 Pairs Left</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Curated Collections (Categories Grid) */}
      <section 
        id="collections-grid"
        className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0a0a0c] border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto">
          {/* Curated Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-luxury-gold font-semibold mb-2 font-mono">Curated Divisions</p>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#EAEAEA] tracking-tight leading-tight italic" id="catalogue-headline">
              Crafted for every <span className="font-medium inline text-luxury-gold font-display">tempo & lifestyle.</span>
            </h2>
          </div>

          {/* 3 Grid Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Category 1: Casual */}
            <div 
              onClick={() => handleCategoryClick('Casual')}
              id="category-card-casual"
              className="group relative h-96 rounded-none overflow-hidden cursor-pointer border border-white/10 flex flex-col justify-end p-6 hover:shadow-xl transition-all duration-500 bg-neutral-900/40"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80" 
                  alt="Casual shoe lineup" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-40 group-hover:opacity-75 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent"></div>
              </div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-luxury-gold/20 backdrop-blur-md flex items-center justify-center mb-3">
                  <Layers className="w-4 h-4 text-luxury-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#EAEAEA] tracking-wide italic">Casual Leisure</h3>
                <p className="text-white/50 text-xs mt-1.5 font-light leading-relaxed">
                  Everyday premium minimalist trainers and high-nap suede soles designed for elevated weekend social hours.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-luxury-gold font-semibold tracking-wider uppercase group-hover:translate-x-1.5 transition-transform">
                  <span>Browse Casual</span>
                  <ArrowRight className="w-3 px-0.5" />
                </div>
              </div>
            </div>

            {/* Category 2: Formal */}
            <div 
              onClick={() => handleCategoryClick('Formal')}
              id="category-card-formal"
              className="group relative h-96 rounded-none overflow-hidden cursor-pointer border border-white/10 flex flex-col justify-end p-6 hover:shadow-xl transition-all duration-500 bg-neutral-900/40"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&auto=format&fit=crop&q=80" 
                  alt="Formal shoe leather" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-40 group-hover:opacity-75 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent"></div>
              </div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-luxury-gold/20 backdrop-blur-md flex items-center justify-center mb-3">
                  <Anchor className="w-4 h-4 text-luxury-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#EAEAEA] tracking-wide italic">Formal Legacy</h3>
                <p className="text-white/50 text-xs mt-1.5 font-light leading-relaxed">
                  Stunning Italian goodyear-welt Oxfords, Brogues, and tailored boots matching elite requirements.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-luxury-gold font-semibold tracking-wider uppercase group-hover:translate-x-1.5 transition-transform">
                  <span>Browse Formal</span>
                  <ArrowRight className="w-3 px-0.5" />
                </div>
              </div>
            </div>

            {/* Category 3: Sport */}
            <div 
              onClick={() => handleCategoryClick('Sport')}
              id="category-card-sport"
              className="group relative h-96 rounded-none overflow-hidden cursor-pointer border border-white/10 flex flex-col justify-end p-6 hover:shadow-xl transition-all duration-500 bg-neutral-900/40"
            >
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80" 
                  alt="Sport dynamic footwear_runner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-40 group-hover:opacity-75 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/95 via-[#050505]/30 to-transparent"></div>
              </div>

              <div className="relative z-10 text-left">
                <div className="w-8 h-8 rounded-full bg-luxury-gold/20 backdrop-blur-md flex items-center justify-center mb-3">
                  <Zap className="w-4 h-4 text-luxury-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#EAEAEA] tracking-wide italic">Kinetic Sport</h3>
                <p className="text-white/50 text-xs mt-1.5 font-light leading-relaxed">
                  Primeknit breathable speed runners and explosive high-rebound foams engineered for peak physical pacing.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-luxury-gold font-semibold tracking-wider uppercase group-hover:translate-x-1.5 transition-transform">
                  <span>Browse Sport</span>
                  <ArrowRight className="w-3 px-0.5" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
