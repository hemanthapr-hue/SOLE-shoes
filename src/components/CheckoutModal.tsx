import React, { useState } from 'react';
import { X, CheckCircle, Package, MapPin, Phone, Mail, User, ShieldCheck, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { createOrder } from '../apiClient';

interface CheckoutModalProps {
  product: Product;
  selectedSize: string;
  onClose: () => void;
  onOrderCompleted: () => void;
}

export default function CheckoutModal({ product, selectedSize, onClose, onOrderCompleted }: CheckoutModalProps) {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  // Validators
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full Name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    // Email regex validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    // Sri Lankan & general international phone validate
    // Sri Lanka: e.g. 0771234567 or +94771234567 or 94771234567
    // Global standard: min 7 digits, max 15 digits, optional leading plus
    const phoneTrimmed = phone.trim().replace(/\s/g, '');
    const lkPhoneRegex = /^(?:\+94|94)?(?:0)?(7[01245678]\d{7})$/;
    const globalPhoneRegex = /^\+?[1-9]\d{7,14}$/;

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      const isLK = lkPhoneRegex.test(phoneTrimmed);
      const isGlobal = globalPhoneRegex.test(phoneTrimmed);
      if (!isLK && !isGlobal) {
        newErrors.phone = 'Enter a valid phone number (e.g. 0771234567 or +94771234567)';
      }
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address for accurate delivery';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await createOrder({
        name,
        email,
        phone,
        address,
        shoe_id: product.id,
        size: selectedSize
      });

      if (result.success) {
        // Generate random tracking ID for luxury aesthetic
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        const code = `SÕLE-COL-${randomNum}`;
        setTrackingId(code);
        setSuccess(true);
      } else {
        setErrors({ submit: result.error || 'Server submission failed. Try again' });
      }
    } catch (err) {
      setErrors({ submit: 'Failed to dispatch order. Contact our support team' });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    onOrderCompleted();
    onClose();
  };

  return (
    <div 
      id="checkout-modal-overlay"
      className="fixed inset-0 bg-[#020202]/92 backdrop-blur-md z-52 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[#09090c] border border-white/10 rounded-none shadow-2xl overflow-hidden relative animate-fade-in text-white max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        id="checkout-modal-box"
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          id="btn-close-checkout"
          className="absolute top-4 right-4 z-15 p-2 rounded-none bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dynamic Screen View: Success vs Form */}
        {success ? (
          /* SUCCESS VIEW SCREEN */
          <div className="p-8 text-center space-y-6 flex flex-col items-center justify-center" id="checkout-success-view">
            <div className="w-16 h-16 rounded-none bg-black/60 border border-luxury-gold/55 flex items-center justify-center text-luxury-gold animate-bounce mb-2">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] tracking-[0.25em] font-mono text-luxury-gold uppercase block">ORDER CONFIRMED</span>
              <h3 className="font-display italic text-2xl sm:text-3xl font-bold text-[#EAEAEA] tracking-tight">
                Thank you for your dispatch!
              </h3>
              <p className="text-white/50 text-xs sm:text-sm font-light max-w-sm mx-auto leading-relaxed">
                Your order for the custom <strong className="font-semibold text-white">{product.title}</strong> has been received and logged in our system. Reference details are shown below.
              </p>
            </div>

            <div className="w-full max-w-sm bg-[#121216]/60 rounded-none p-5 border border-white/10 text-left space-y-3.5">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
                <span className="text-white/40 font-mono text-[10px]">Tracking Reference:</span>
                <span className="font-mono font-bold text-luxury-gold bg-white/5 border border-white/10 px-2 py-0.5 rounded-none select-all" id="success-tracking-id">
                  {trackingId}
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                <p className="flex justify-between text-white/60">
                  <span>Shoe selection:</span>
                  <strong className="text-[#EAEAEA]">{product.title} (Size {selectedSize})</strong>
                </p>
                <p className="flex justify-between text-white/60">
                  <span>Consignee Name:</span>
                  <strong className="text-[#EAEAEA]">{name}</strong>
                </p>
                <p className="flex justify-between text-white/60">
                  <span>Delivery Address:</span>
                  <strong className="text-[#EAEAEA] truncate max-w-[180px]" title={address}>{address}</strong>
                </p>
                <p className="flex justify-between text-white/70 pt-2.5 border-t border-dashed border-white/10">
                  <span>Subtotal Paid:</span>
                  <strong className="text-luxury-gold font-bold">${product.price.toFixed(2)}</strong>
                </p>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="p-3.5 bg-white/5 rounded-none text-[11px] text-white/60 flex items-start gap-2.5 text-left border border-white/10">
                <Package className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <p className="leading-relaxed font-light">
                  Our courier division will catalog your package shortly. Standard dispatch takes <strong>2-3 business days</strong> within Sri Lanka, and 5-7 business days internationally. You will receive an email invoice shortly.
                </p>
              </div>

              <button
                onClick={handleSuccessClose}
                id="btn-success-continue"
                className="w-full py-4 bg-luxury-gold hover:brightness-110 text-black font-sans text-xs tracking-widest uppercase font-bold transition rounded-none text-center cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* ORDER REGISTRATION FORM SCREEN */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-left" id="checkout-form-view">
            
            <div className="space-y-1">
              <h3 className="font-display italic text-xl sm:text-3xl font-black text-[#EAEAEA] tracking-tight" id="checkout-form-title">
                Complete Dispatch Registration
              </h3>
              <p className="text-white/45 text-xs sm:text-sm font-light">
                Fill in your correct information to secure your shoe courier dispatch.
              </p>
            </div>

            {/* Read-only Selection Summary */}
            <div className="bg-[#121216]/40 rounded-none p-4 border border-white/5 flex gap-4 items-center">
              <img 
                src={product.image_url} 
                alt={product.title} 
                className="w-16 h-16 object-cover rounded-none border border-white/10 bg-black shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex justify-between items-start">
                  <h4 className="font-display font-bold text-sm text-[#EAEAEA] line-clamp-1">{product.title}</h4>
                  <span className="font-mono font-bold text-sm text-luxury-gold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                  <span className="bg-white/5 text-luxury-gold border border-white/10 px-2 py-0.5 rounded-none">Size Selected: {selectedSize}</span>
                  <span className="bg-white/5 text-white/50 border border-white/10 px-2 py-0.5 rounded-none">Brand: {product.brand}</span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-rose-950/50 text-rose-450 border border-rose-900 rounded-none text-xs font-mono" id="submit-error-banner">
                ❌ {errors.submit}
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                  Consignee's Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Enter your first and last name"
                    className={`w-full bg-[#121216]/60 border rounded-none py-3.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition ${
                      errors.name 
                        ? 'border-rose-500 focus:border-rose-500' 
                        : 'border-white/10 focus:border-luxury-gold'
                    }`}
                    id="input-full-name"
                  />
                </div>
                {errors.name && <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400 mt-1" id="error-name">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      placeholder="e.g. aruni@gmail.com"
                      className={`w-full bg-[#121216]/60 border rounded-none py-3.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition ${
                        errors.email 
                          ? 'border-rose-500 focus:border-rose-500' 
                          : 'border-white/10 focus:border-luxury-gold'
                      }`}
                      id="input-email-address"
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400 mt-1" id="error-email">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                      }}
                      placeholder="e.g. 0771234567"
                      className={`w-full bg-[#121216]/60 border rounded-none py-3.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition ${
                        errors.phone 
                          ? 'border-rose-500 focus:border-rose-500' 
                          : 'border-white/10 focus:border-luxury-gold'
                      }`}
                      id="input-phone-number"
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400 mt-1" id="error-phone">{errors.phone}</p>}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/40 block pb-0.5">
                  Courier Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-white/30 pointer-events-none" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors(prev => ({ ...prev, address: '' }));
                    }}
                    placeholder="Provide full street address, apartment, city, postal code"
                    className={`w-full bg-[#121216]/60 border rounded-none py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-white/20 focus:outline-none transition ${
                      errors.address 
                        ? 'border-rose-500 focus:border-rose-500' 
                        : 'border-white/10 focus:border-luxury-gold'
                    }`}
                    id="input-delivery-address"
                  />
                </div>
                {errors.address && <p className="text-[10px] font-mono uppercase tracking-wider text-rose-400 mt-1" id="error-address">{errors.address}</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                id="btn-form-submit-order"
                className="w-full py-4 bg-luxury-gold hover:brightness-110 disabled:bg-[#151515] text-black font-sans text-xs tracking-widest uppercase font-bold transition rounded-none text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-luxury-gold/5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span>Transmitting Order to Sheets...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Submit & Dispatch Order</span>
                  </>
                )}
              </button>
              
              <div className="text-[9px] font-mono tracking-widest text-[#C5A059]/60 text-center flex items-center justify-center gap-1 uppercase">
                <span>🔒 Secure AES 256 End-To-End Sheets Execution Layer</span>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
