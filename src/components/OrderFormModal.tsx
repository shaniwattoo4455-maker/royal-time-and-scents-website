import React, { useState, useEffect } from 'react';
import { X, MessageCircle, CheckCircle2, Copy, Check, Minus, Plus, ShieldCheck } from 'lucide-react';
import {
  Product,
  PAKISTAN_CITIES,
  formatPKR,
  STORE_CONFIG,
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from '../data/products';
import { CartItem } from './CartDrawer';

export interface OrderTarget {
  mode: 'single' | 'cart';
  product?: Product;
  sizeLabel?: string;
  unitPrice?: number;
  quantity?: number;
}

interface OrderFormModalProps {
  isOpen: boolean;
  orderTarget: OrderTarget | null;
  allProducts: Product[];
  cartItems: CartItem[];
  whatsappNumber: string;
  onClose: () => void;
  onOrderSubmitted?: () => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  orderTarget,
  allProducts,
  cartItems,
  whatsappNumber,
  onClose,
  onOrderSubmitted,
}) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [city, setCity] = useState('Lahore');
  const [completeAddress, setCompleteAddress] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSizeLabel, setSelectedSizeLabel] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState<string | null>(null);
  const [generatedMessagePreview, setGeneratedMessagePreview] = useState('');
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderTarget) return;
    setSubmittedWhatsAppUrl(null);
    setGeneratedMessagePreview('');
    setCopiedMessage(false);

    if (orderTarget.mode === 'single' && orderTarget.product) {
      setSelectedProductId(orderTarget.product.id);
      setSelectedSizeLabel(
        orderTarget.sizeLabel ||
          orderTarget.product.sizes[0]?.label ||
          (orderTarget.product.type === 'perfume' ? '50ml Flacon' : '40mm Standard')
      );
      setQuantity(orderTarget.quantity || 1);
    } else if (allProducts.length > 0) {
      setSelectedProductId(allProducts[0].id);
      setSelectedSizeLabel(allProducts[0].sizes[0]?.label || 'Standard');
      setQuantity(1);
    }
  }, [isOpen, orderTarget, allProducts]);

  if (!isOpen || !orderTarget) return null;

  const isCartCheckout = orderTarget.mode === 'cart' && cartItems.length > 0;
  const activeProduct =
    allProducts.find((p) => p.id === selectedProductId) ||
    orderTarget.product ||
    allProducts[0];

  const activeSizeObj =
    activeProduct?.sizes.find((s) => s.label === selectedSizeLabel) ||
    activeProduct?.sizes[0] || { label: selectedSizeLabel || 'Standard', priceDelta: 0 };

  const singleUnitPrice = (activeProduct?.price || 0) + (activeSizeObj?.priceDelta || 0);
  const singleTotalPrice = singleUnitPrice * quantity;

  const cartTotalPrice = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const cartTotalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const finalProductLabel = isCartCheckout
    ? cartItems
        .map(
          (item) =>
            `${item.product.name} (${item.sizeLabel}) x${item.quantity} [${formatPKR(
              item.unitPrice * item.quantity
            )}]`
        )
        .join('; ')
    : `${activeProduct?.name} (${activeSizeObj.label})`;

  const finalQuantity = isCartCheckout ? cartTotalQuantity : quantity;
  const finalTotalPrice = isCartCheckout ? cartTotalPrice : singleTotalPrice;

  const messageParams = {
    customerName: fullName,
    productName: finalProductLabel,
    quantity: finalQuantity,
    priceFormatted: `${formatPKR(finalTotalPrice)} (Cash on Delivery)`,
    city,
    completeAddress,
    phoneNumber,
    whatsappNumber: customerWhatsapp || phoneNumber,
    orderNotes,
  };

  const liveWhatsAppMessage = buildWhatsAppOrderMessage(messageParams);
  const liveWhatsAppUrl = buildWhatsAppOrderUrl(whatsappNumber, messageParams);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedMessagePreview(liveWhatsAppMessage);
    setSubmittedWhatsAppUrl(liveWhatsAppUrl);

    const anchor = document.createElement('a');
    anchor.href = liveWhatsAppUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    if (isCartCheckout && onOrderSubmitted) {
      onOrderSubmitted();
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(generatedMessagePreview || liveWhatsAppMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#121215] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#16161A]">
          <div>
            <span className="text-xs text-[#D4AF37] font-medium block">
              Owner: {STORE_CONFIG.ownerName} · WhatsApp: {STORE_CONFIG.whatsappDisplay}
            </span>
            <h2 id="order-modal-title" className="font-display text-2xl font-semibold text-[#F5F3EF]">
              {submittedWhatsAppUrl ? 'Order Ready for WhatsApp Confirmation' : 'Buy Now — WhatsApp Order Form'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order form"
            className="w-9 h-9 rounded-lg border border-white/10 text-[#9E9A90] hover:text-[#F5F3EF] inline-flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedWhatsAppUrl ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-[#18261D] border border-[#25D366]/40">
              <CheckCircle2 className="w-6 h-6 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-[#F5F3EF]">
                  WhatsApp Order Message Created
                </h3>
                <p className="text-xs text-[#C8C4BC] mt-1">
                  Your order has been prepared for WhatsApp{' '}
                  <span className="font-mono-num text-[#D4AF37]">{STORE_CONFIG.whatsappDisplay}</span>{' '}
                  (International link: <span className="font-mono-num">{whatsappNumber}</span>).
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-[#9E9A90] mb-2">
                <span>Pre-Filled WhatsApp Order Message</span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1.5 text-[#D4AF37] hover:underline cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied to Clipboard
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Order Message
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-[#0B0B0C] border border-white/10 text-xs text-[#E5E0D8] font-mono whitespace-pre-wrap leading-relaxed">
                {generatedMessagePreview}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={submittedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 h-11 px-5 rounded-lg bg-[#25D366] text-[#0B0B0C] text-xs font-semibold hover:bg-[#2CE070] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp ({STORE_CONFIG.whatsappDisplay})</span>
              </a>
              <button
                type="button"
                onClick={() => setSubmittedWhatsAppUrl(null)}
                className="w-full sm:w-auto h-11 px-4 rounded-lg border border-white/15 text-xs font-medium text-[#C8C4BC] hover:text-[#F5F3EF] transition-colors cursor-pointer"
              >
                Edit Details
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-5">
            {/* Selected Product / Cart Summary Box */}
            <div className="p-4 rounded-xl bg-[#17171B] border border-white/10 space-y-3">
              {isCartCheckout ? (
                <div>
                  <div className="text-xs font-medium text-[#9E9A90] mb-1">
                    Ordering {cartTotalQuantity} Item(s) from Shopping Bag
                  </div>
                  <div className="text-xs text-[#E5E0D8] space-y-1">
                    {cartItems.map((item) => (
                      <div key={item.key} className="flex justify-between">
                        <span>
                          {item.product.name} ({item.sizeLabel}) × {item.quantity}
                        </span>
                        <span className="font-mono-num text-[#D4AF37]">
                          {formatPKR(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-xs font-semibold">
                    <span className="text-[#F5F3EF]">Total Order Amount</span>
                    <span className="font-mono-num text-sm text-[#D4AF37]">
                      {formatPKR(cartTotalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-medium text-[#9E9A90] mb-1.5">
                      Product
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => {
                        const newProd = allProducts.find((p) => p.id === e.target.value);
                        setSelectedProductId(e.target.value);
                        if (newProd && newProd.sizes[0]) {
                          setSelectedSizeLabel(newProd.sizes[0].label);
                        }
                      }}
                      className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {formatPKR(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-[#9E9A90] mb-1.5">
                      Option / Size
                    </label>
                    <select
                      value={activeSizeObj.label}
                      onChange={(e) => setSelectedSizeLabel(e.target.value)}
                      className="w-full h-10 px-2.5 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {activeProduct?.sizes.map((s) => (
                        <option key={s.label} value={s.label}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-[#9E9A90] mb-1.5">
                      Quantity
                    </label>
                    <div className="h-10 flex items-center justify-between rounded-lg border border-white/15 bg-[#111114] px-2">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="text-[#E5E0D8] hover:text-[#D4AF37] p-1 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-num text-xs font-semibold text-[#F5F3EF]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="text-[#E5E0D8] hover:text-[#D4AF37] p-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-12 pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-[#9E9A90]">
                      Unit Price:{' '}
                      <strong className="font-mono-num text-[#E5E0D8]">
                        {formatPKR(singleUnitPrice)}
                      </strong>
                    </span>
                    <span className="text-[#F5F3EF] font-semibold">
                      Total Payable:{' '}
                      <strong className="font-mono-num text-sm text-[#D4AF37]">
                        {formatPKR(singleTotalPrice)}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Muhammad Usman Khan"
                  className="w-full h-10 px-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (!customerWhatsapp) setCustomerWhatsapp(e.target.value);
                  }}
                  placeholder="e.g. 0311 6164092"
                  className="w-full h-10 px-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={customerWhatsapp}
                  onChange={(e) => setCustomerWhatsapp(e.target.value)}
                  placeholder="e.g. 0311 6164092"
                  className="w-full h-10 px-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  list="pakistan-cities-list"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Select or type city (e.g. Lahore, Karachi)"
                  className="w-full h-10 px-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
                />
                <datalist id="pakistan-cities-list">
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                Complete Delivery Address *
              </label>
              <textarea
                rows={2}
                required
                value={completeAddress}
                onChange={(e) => setCompleteAddress(e.target.value)}
                placeholder="House / Street / Sector / Phase / Nearest Landmark"
                className="w-full p-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C8C4BC] mb-1.5">
                Order Notes (Optional)
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Gift wrap request, preferred delivery time, or fragrance preference"
                className="w-full h-10 px-3.5 rounded-lg bg-[#17171B] border border-white/15 text-xs text-[#F5F3EF] placeholder-[#6E6A63] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full h-12 px-6 rounded-lg bg-[#25D366] text-[#0B0B0C] text-sm font-semibold hover:bg-[#2CE070] transition-colors inline-flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp — {formatPKR(finalTotalPrice)}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A857B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  WhatsApp: {STORE_CONFIG.whatsappDisplay} (wa.me/{whatsappNumber}) · Cash on Delivery Across Pakistan
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
