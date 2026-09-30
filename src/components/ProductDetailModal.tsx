import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { Product, formatPKR, buildWhatsAppOrderUrl } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  whatsappNumber: string;
  onClose: () => void;
  onAddToCart: (product: Product, sizeLabel: string, unitPrice: number, quantity: number) => void;
  onBuyNow: (product: Product, sizeLabel: string, unitPrice: number, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  whatsappNumber,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const currentSize = product.sizes[selectedSizeIndex] || {
    label: product.type === 'perfume' ? '50ml Flacon' : 'Standard Size',
    priceDelta: 0,
  };

  const unitPrice = product.price + currentSize.priceDelta;
  const oldUnitPrice = product.oldPrice ? product.oldPrice + currentSize.priceDelta : undefined;
  const totalPrice = unitPrice * quantity;

  const directWhatsAppUrl = buildWhatsAppOrderUrl(whatsappNumber, {
    productName: `${product.name}${product.type === 'watch' ? ' [Replica / Copy]' : ''} (${currentSize.label})`,
    quantity,
    priceFormatted: formatPKR(totalPrice),
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121215] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#0B0B0C]/85 border border-white/15 text-[#F5F3EF] hover:text-[#D4AF37] hover:border-[#D4AF37] inline-flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contiguous Purchase Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Consistent 1:1 Square Gallery */}
          <div className="bg-[#17171B] flex flex-col justify-between p-6 sm:p-8 border-b md:border-b-0 md:border-r border-white/10">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0E0E11] border border-white/10">
              <ResilientImage
                src={product.image}
                alt={product.name}
                fallbackType={product.type}
                title={product.name}
                className={`w-full h-full object-cover object-center ${product.imageStyle || ''}`}
              />
              <span className="absolute top-3 left-3 bg-[#0B0B0C]/90 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold px-2.5 py-1 rounded">
                {product.type === 'watch'
                  ? product.replicaLabel || 'Replica / Copy'
                  : `Save ${product.discountPercent || 18}%`}
              </span>
            </div>

            {/* Domain Specifications Sheet */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs">
              <div className="text-[#9E9A90] font-medium mb-2">
                {product.type === 'watch' ? 'Watch Details (Replica / Copy)' : 'Fragrance Profile'}
              </div>

              {product.type === 'watch' ? (
                <>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8A857B]">Edition Type</span>
                    <span className="text-[#D4AF37] font-semibold">
                      {product.replicaLabel || 'Replica / Copy'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8A857B]">Movement</span>
                    <span className="text-[#E5E0D8] font-medium">
                      {product.movement || 'Quartz Movement (Replica / Copy)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8A857B]">Case &amp; Finish</span>
                    <span className="text-[#E5E0D8] font-medium">
                      {product.caseMaterial || 'Gold-Tone Finish & Chain'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-[#8A857B]">Concentration</span>
                    <span className="text-[#E5E0D8] font-medium">
                      {product.fragranceType || 'Eau de Parfum'}
                    </span>
                  </div>
                  {product.scentNotes && (
                    <>
                      <div className="py-1 border-b border-white/5">
                        <span className="text-[#8A857B] block">Top Notes</span>
                        <span className="text-[#E5E0D8]">{product.scentNotes.top}</span>
                      </div>
                      <div className="py-1 border-b border-white/5">
                        <span className="text-[#8A857B] block">Heart Notes</span>
                        <span className="text-[#E5E0D8]">{product.scentNotes.heart}</span>
                      </div>
                      <div className="py-1">
                        <span className="text-[#8A857B] block">Base Notes</span>
                        <span className="text-[#E5E0D8]">{product.scentNotes.base}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Unboxed Metadata */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-[#9E9A90] mb-2">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                {product.type === 'watch' && (
                  <>
                    <span className="text-[#D4AF37] font-semibold">
                      {product.replicaLabel || 'Replica / Copy'}
                    </span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span className="font-mono-num">SKU: {product.sku}</span>
              </div>

              <h2
                id="pdp-modal-title"
                className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F3EF] leading-tight mb-3"
              >
                {product.name}
              </h2>

              {/* Price Display */}
              <div className="flex items-baseline gap-3 mb-4 pb-4 border-b border-white/10">
                <span className="font-mono-num text-2xl font-semibold text-[#D4AF37]">
                  {formatPKR(unitPrice)}
                </span>
                {oldUnitPrice && oldUnitPrice > unitPrice && (
                  <span className="font-mono-num text-sm text-[#7D7970] line-through">
                    {formatPKR(oldUnitPrice)}
                  </span>
                )}
                {product.type === 'watch' && (
                  <span className="ml-auto text-xs text-[#D4AF37] font-medium">
                    Replica / Copy
                  </span>
                )}
              </div>

              <p className="text-sm text-[#C8C4BC] leading-relaxed mb-6">
                {product.fullDescription}
              </p>

              {/* Size Selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[#9E9A90] mb-2">
                  {product.type === 'perfume' ? 'Select Bottle Size' : 'Select Option'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sizeObj, idx) => {
                    const isSelected = idx === selectedSizeIndex;
                    return (
                      <button
                        key={sizeObj.label}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                          isSelected
                            ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5F3EF]'
                            : 'border-white/15 bg-[#17171B] text-[#9E9A90] hover:text-[#F5F3EF]'
                        }`}
                      >
                        <span>{sizeObj.label}</span>
                        {sizeObj.priceDelta > 0 && (
                          <span className="font-mono-num ml-1.5 text-[#D4AF37]">
                            (+{formatPKR(sizeObj.priceDelta)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-[#9E9A90] mb-2">
                  Quantity
                </label>
                <div className="inline-flex items-center rounded-lg border border-white/15 bg-[#17171B]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-10 h-10 inline-flex items-center justify-center text-[#E5E0D8] hover:text-[#D4AF37] cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-mono-num text-sm font-medium text-[#F5F3EF]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="w-10 h-10 inline-flex items-center justify-center text-[#E5E0D8] hover:text-[#D4AF37] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {quantity > 1 && (
                  <span className="ml-3 text-xs text-[#9E9A90] font-mono-num">
                    Subtotal: {formatPKR(totalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Primary Purchase & Order Actions */}
            <div className="space-y-2.5 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onAddToCart(product, currentSize.label, unitPrice, quantity);
                    onClose();
                  }}
                  className="h-11 px-4 rounded-lg border border-[#D4AF37]/60 bg-[#17171B] text-xs font-semibold text-[#F5F3EF] hover:bg-[#D4AF37]/15 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onBuyNow(product, currentSize.label, unitPrice, quantity);
                  }}
                  className="h-11 px-4 rounded-lg bg-[#D4AF37] text-xs font-semibold text-[#0B0B0C] hover:bg-[#E5C354] transition-colors inline-flex items-center justify-center whitespace-nowrap cursor-pointer"
                >
                  Buy Now — {formatPKR(totalPrice)}
                </button>
              </div>

              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 px-4 rounded-lg bg-[#25D366] text-[#0B0B0C] text-xs font-semibold hover:bg-[#2CE070] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp (03116164092)</span>
              </a>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#8A857B]">
                <span className="inline-flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Fast Nationwide Delivery
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Cash on Delivery Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
