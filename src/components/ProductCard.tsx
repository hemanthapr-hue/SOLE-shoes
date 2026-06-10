import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-[#0a0a0c]/85 border border-white/10 rounded-none overflow-hidden flex flex-col justify-between transition-all duration-300 luxury-shadow-hover hover:border-luxury-gold/50"
    >
      {/* Product Image Area with Category Overlay & Zoom trigger */}
      <div 
        onClick={() => onViewDetails(product)}
        className="relative aspect-square w-full bg-neutral-950 overflow-hidden cursor-pointer border-b border-white/5"
        id={`product-card-image-box-${product.id}`}
      >
        <img 
          src={product.image_url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000'} 
          alt={product.title} 
          className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-550 ease-out"
          referrerPolicy="no-referrer"
        />
        
        {/* Category Tag Badge */}
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-none text-[9px] tracking-widest uppercase font-mono text-luxury-gold">
          <Tag className="w-2.5 h-2.5 text-luxury-gold" />
          <span>{product.category}</span>
        </div>
      </div>

      {/* Product Metadata & CTA */}
      <div className="p-5 flex flex-col items-start gap-3 text-left">
        <div className="w-full">
          <p className="text-[9px] font-mono tracking-widest uppercase text-white/40 font-bold mb-1">{product.brand}</p>
          <h4 className="font-display text-lg italic font-bold text-[#EAEAEA] tracking-tight line-clamp-1 group-hover:text-luxury-gold transition-colors">
            {product.title}
          </h4>
        </div>

        {/* Short description truncated */}
        <p className="text-white/55 text-xs font-light line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Footer info: price and View details */}
        <div className="w-full pt-4 mt-1 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono text-base font-bold text-[#EAEAEA]">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </span>
          
          <button
            onClick={() => onViewDetails(product)}
            id={`btn-view-details-${product.id}`}
            className="text-[10px] tracking-widest uppercase font-bold text-luxury-gold hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
