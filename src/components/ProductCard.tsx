import React, { useRef } from 'react';
import { ShoppingBag, ArrowUpRight, MessageCircle, Camera } from 'lucide-react';
import { Product, formatPKR, buildWhatsAppOrderUrl, cropWatchImageToSquareDataUrl } from '../data/products';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, sizeLabel: string, unitPrice: number) => void;
  onBuyNow: (product: Product, sizeLabel: string, unitPrice: number) => void;
  onUpdateProductImage?: (productId: string, newDataUrl: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  whatsappNumber,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onUpdateProductImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const defaultSize =
    product.sizes[0]?.label || (product.type === 'perfume' ? '50ml Flacon' : 'Standard Size');
  const unitPrice = product.price + (product.sizes[0]?.priceDelta || 0);
  const isOutOfStock = product.stockStatus === 'Out of Stock';

  const directWhatsAppUrl = buildWhatsAppOrderUrl(whatsappNumber, {
    productName: `${product.name}${product.type === 'watch' ? ' [Replica / Copy]' : ''} (${defaultSize})`,
    quantity: 1,
    priceFormatted: formatPKR(unitPrice),
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateProductImage) return;
    try {
      const squareDataUrl = await cropWatchImageToSquareDataUrl(file, true);
      onUpdateProductImage(product.id, squareDataUrl);
    } catch {
      // ignore error
    }
    e.target.value = '';
  };

  return (
    <article className="group flex flex-col bg-[#131316] border border-white/10 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/40">
      {/* Consistent 1:1 Square Product Image Area — Clickable */}
      <div
        onClick={() => onSelectProduct(product)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectProduct(product);
          }
        }}
        aria-label={`View details for ${product.name}`}
        className="relative aspect-square w-full bg-[#18181C] overflow-hidden cursor-pointer"
      >
        <ResilientImage
          src={product.image}
          alt={product.name}
          fallbackType={product.type}
          title={product.name}
          className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${product.imageStyle || ''}`}
        />

        {/* Subtle gradient scrim at bottom for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C]/65 via-transparent to-transparent pointer-events-none" />

        {/* Top-left Replica / Copy or Discount label */}
        <span className="absolute top-3 left-3 bg-[#0B0B0C]/90 border border-[#D4AF37]/50 text-[#D4AF37] text-[11px] font-semibold px-2.5 py-1 rounded">
          {product.type === 'watch'
            ? product.replicaLabel || 'Replica / Copy'
            : product.discountPercent
            ? `-${product.discountPercent}% OFF`
            : 'Signature Scent'}
        </span>

        {/* Optional Quick Photo Replace button for Owner */}
        {onUpdateProductImage && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              title="Replace with your photo from device"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg bg-[#0B0B0C]/85 border border-white/20 text-[#E5E0D8] hover:text-[#D4AF37] hover:border-[#D4AF37] inline-flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Quick detail hint on hover */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 text-xs font-medium text-[#F5F3EF] bg-[#0B0B0C]/85 px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Inspect <ArrowUpRight className="w-3.5 h-3.5 text-[#D4AF37]" />
        </span>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs text-[#9E9A90] mb-1.5">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          {product.type === 'watch' ? (
            <>
              <span className="text-[#D4AF37] font-medium">
                {product.replicaLabel || 'Replica / Copy'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.stockStatus}</span>
            </>
          ) : (
            <>
              <span className="text-[#D4AF37]/90">{product.fragranceType || 'Eau de Parfum'}</span>
              <span aria-hidden="true">·</span>
              <span>{product.defaultSizeLabel || '50ml / 100ml'}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-display text-xl font-semibold text-[#F5F3EF] leading-snug mb-1.5">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left hover:text-[#D4AF37] transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </button>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#A9A49A] leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.shortDescription}
        </p>

        {/* Price Row in PKR with Tabular Numerals */}
        <div className="pt-3 border-t border-white/10 flex items-baseline justify-between gap-2 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-num text-base font-semibold text-[#D4AF37]">
              {formatPKR(unitPrice)}
            </span>
            {product.oldPrice && product.oldPrice > unitPrice && (
              <span className="font-mono-num text-xs text-[#7D7970] line-through">
                {formatPKR(product.oldPrice)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-[#9E9A90] whitespace-nowrap">
            {product.type === 'watch' ? 'Replica / Copy' : product.stockStatus}
          </span>
        </div>

        {/* Action Buttons: Add to Cart, Buy Now & Order on WhatsApp */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product, defaultSize, unitPrice)}
              className="h-9 px-3 rounded-lg border border-white/15 bg-[#1B1B20] text-xs font-medium text-[#F5F3EF] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => onBuyNow(product, defaultSize, unitPrice)}
              className="h-9 px-3 rounded-lg bg-[#D4AF37] text-xs font-semibold text-[#0B0B0C] hover:bg-[#E5C354] transition-colors inline-flex items-center justify-center whitespace-nowrap disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-9 px-3 rounded-lg bg-[#17261C] border border-[#25D366]/35 text-xs font-medium text-[#E5E0D8] hover:border-[#25D366] hover:text-white transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </article>
  );
};
