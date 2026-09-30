import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { Product, formatPKR, STORE_CONFIG, buildWhatsAppOrderUrl } from '../data/products';
import { ResilientImage } from './ResilientImage';

export interface CartItem {
  key: string; // `${product.id}__${sizeLabel}`
  product: Product;
  sizeLabel: string;
  unitPrice: number;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  whatsappNumber: string;
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
  onProceedToOrderForm: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  whatsappNumber,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToOrderForm,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee =
    subtotal === 0 || subtotal >= STORE_CONFIG.freeDeliveryThreshold
      ? 0
      : STORE_CONFIG.standardDeliveryFee;
  const total = subtotal + deliveryFee;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const cartProductSummary = items
    .map((item) => `${item.product.name} (${item.sizeLabel}) x${item.quantity}`)
    .join(', ');

  const directCartWhatsAppUrl = buildWhatsAppOrderUrl(whatsappNumber, {
    productName: cartProductSummary || 'Selected Items',
    quantity: totalQuantity,
    priceFormatted: formatPKR(total),
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#121215] border-l border-white/15 h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h2 id="cart-drawer-title" className="font-display text-2xl font-semibold text-[#F5F3EF]">
              Your Shopping Bag
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="w-9 h-9 rounded-lg border border-white/10 text-[#9E9A90] hover:text-[#F5F3EF] inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-[#8A857B]" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#F5F3EF] mb-1">
                Your bag is currently empty
              </h3>
              <p className="text-xs text-[#8A857B] max-w-xs mb-6">
                Explore our curated collection of luxury watches (PKR 2,400 – 5,800) and signature fragrances.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold hover:bg-[#E5C354] transition-colors cursor-pointer"
              >
                Continue Exploring
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-[#9E9A90] pb-2 border-b border-white/10">
                <span>{totalQuantity} selected item(s)</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-[#9E9A90] hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-3.5 p-3.5 rounded-xl bg-[#17171B] border border-white/10"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#0E0E11] shrink-0 border border-white/10">
                    <ResilientImage
                      src={item.product.image}
                      alt={item.product.name}
                      fallbackType={item.product.type}
                      title={item.product.name}
                      className={`w-full h-full object-cover ${item.product.imageStyle || ''}`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-display text-base font-semibold text-[#F5F3EF] truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-[#7D7970] hover:text-red-400 transition-colors p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#9E9A90] mt-0.5">
                      {item.sizeLabel} · {formatPKR(item.unitPrice)} each
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded border border-white/15 bg-[#121215]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, -1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 inline-flex items-center justify-center text-[#E5E0D8] hover:text-[#D4AF37] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono-num text-xs font-medium text-[#F5F3EF]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.key, 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 inline-flex items-center justify-center text-[#E5E0D8] hover:text-[#D4AF37] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono-num text-xs font-semibold text-[#D4AF37]">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Cart Footer Summary */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#151519] space-y-3">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#A9A49A]">
                <span>Subtotal</span>
                <span className="font-mono-num text-[#F5F3EF]">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#A9A49A]">
                <span>Nationwide Delivery</span>
                <span className="font-mono-num text-[#D4AF37]">
                  {deliveryFee === 0 ? 'FREE' : formatPKR(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-semibold text-[#F5F3EF]">
                <span>Total Payable (PKR)</span>
                <span className="font-mono-num text-base text-[#D4AF37]">{formatPKR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToOrderForm}
              className="w-full h-11 px-5 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold hover:bg-[#E5C354] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buy Now (Fill Delivery Form)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={directCartWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 px-5 rounded-lg bg-[#25D366] text-[#0B0B0C] text-xs font-semibold hover:bg-[#2CE070] transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp (03116164092)</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
