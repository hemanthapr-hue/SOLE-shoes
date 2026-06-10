import React, { useState } from 'react';
import { X, Calendar, Truck, ArrowLeft, Ruler } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onProceedToCheckout: (product: Product, selectedSize: string) => void;
}

export default function ProductModal({ product, onClose, onProceedToCheckout }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizeError, setSizeError] = useState<boolean>(false);

  if (!product) return null;

  const handleBuyClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    onProceedToCheckout(product, selectedSize);
  };

  return (
    <div 
      id={`product-detail-modal-overlay-${product.id}`}
      className="fixed inset-0 bg-[#020202]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl bg-[#09090c] border border-white/10 rounded-none shadow-2xl overflow-hidden relative animate-fade-in text-white max-h-[90vh] md:max-h-auto overflow-y-auto md:overflow-visible transition-all"
        onClick={(e) => e.stopPropagation()}
        id={`product-detail-modal-box-${product.id}`}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          id="btn-close-product-modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left panel: Large high-res picture */}
          <div className="md:col-span-6 bg-[#000] relative aspect-square md:aspect-auto md:h-[600px] border-r border-white/10">
            <img 
              src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'} 
              alt={product.title} 
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Soft luxury badge */}
            <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 text-luxury-gold font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-none uppercase backdrop-blur-md">
              SÕLE Premium Division
            </div>
          </div>

          {/* Right panel: Meta and Selectors */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between text-left h-auto md:h-[600px] overflow-y-auto bg-[#09090c]">
            
            <div className="space-y-5">
              {/* Product Category & Brand */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-luxury-gold font-bold block">{product.brand}</span>
                <h3 className="font-display text-2xl sm:text-4xl font-extrabold italic tracking-tight text-[#EAEAEA]" id="modal-product-title">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-white/5 border border-white/10 text-luxury-gold px-2.5 py-0.5 rounded-none text-[9px] uppercase font-mono">
                    {product.category}
                  </span>
                  <span className="text-white/20 text-sm">|</span>
                  <span className="text-white/40 text-xs flex items-center gap-1">
                    <Ruler className="w-3.5 h-3.5 text-white/30" />
                    Standard Sizing US Chart
                  </span>
                </div>
              </div>

              {/* Price Tag */}
              <div className="font-display italic text-lg text-[#EAEAEA] py-2 border-y border-white/10 flex items-center justify-between">
                <span>Total Amount:</span>
                <span className="text-luxury-gold font-mono font-bold text-2xl">${product.price ? product.price.toFixed(2) : '0.00'}</span>
              </div>

              {/* Description body */}
              <div className="space-y-2">
                <h4 className="text-[9px] font-mono uppercase tracking-wider text-white/30 font-semibold subtitle">Product Features & Materials</h4>
                <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Select size chips */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[9px] font-mono uppercase tracking-wider text-white/30 font-semibold">
                    Select Size
                  </h4>
                  {sizeError && (
                    <span className="text-rose-500 text-[10px] font-mono uppercase tracking-wider" id="size-warning-badge">
                      ⚠️ Choose a size
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2.5" id="size-chips-list">
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        id={`btn-size-chip-${size}`}
                        className={`w-11 h-11 text-xs rounded-none border font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                          selectedSize === size
                            ? 'bg-luxury-gold border-luxury-gold text-black shadow-lg shadow-luxury-gold/15'
                            : 'bg-white/5 border-white/10 text-white/80 hover:border-luxury-gold/50 hover:bg-white/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <span className="text-white/40 font-mono text-xs italic">No individual sizes declared. Contact administration.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal buy action */}
            <div className="pt-6 border-t border-white/10 space-y-4 mt-6">
              <button
                onClick={handleBuyClick}
                id="btn-modal-buy-now"
                className="w-full py-4 bg-luxury-gold hover:brightness-110 text-black font-sans text-xs tracking-widest uppercase font-bold transition rounded-none text-center cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Checkout</span>
              </button>

              <div className="grid grid-cols-2 gap-4 text-[9px] font-mono uppercase tracking-wider text-white/45 text-center pb-1">
                <div className="flex items-center gap-1.5 justify-left">
                  <Truck className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>Complimentary Shipping</span>
                </div>
                <div className="flex items-center gap-1.5 justify-left">
                  <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                  <span>30-Day Exchange Guarantee</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
