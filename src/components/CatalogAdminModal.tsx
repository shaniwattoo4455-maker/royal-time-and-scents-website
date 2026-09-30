import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Edit3, Save } from 'lucide-react';
import {
  Product,
  ProductCategory,
  StockStatus,
  formatPKR,
  CATEGORIES,
  PRODUCT_IMAGES,
} from '../data/products';

interface CatalogAdminModalProps {
  isOpen: boolean;
  products: Product[];
  whatsappNumber: string;
  onUpdateWhatsappNumber: (num: string) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetCatalog: () => void;
  onClose: () => void;
}

const DEFAULT_IMAGES = [
  {
    label: '1. Rado Style Gold Classic Watch',
    url: PRODUCT_IMAGES.watch1,
  },
  {
    label: '2. Rado Style Gold Diamond Dial Watch',
    url: PRODUCT_IMAGES.watch2,
  },
  {
    label: '3. Rado Style Gold Premium Watch',
    url: PRODUCT_IMAGES.watch3,
  },
  {
    label: '4. Gold Luxury Style Watch',
    url: PRODUCT_IMAGES.watch4,
  },
  {
    label: '5. Gold Classic Chain Watch',
    url: PRODUCT_IMAGES.watch5,
  },
  {
    label: '6. Gold Elegant Dial Watch',
    url: PRODUCT_IMAGES.watch6,
  },
  {
    label: '7. Rado Style Premium Gold Watch',
    url: PRODUCT_IMAGES.watch7,
  },
  {
    label: '8. Gold Stone Dial Watch',
    url: PRODUCT_IMAGES.watch8,
  },
  {
    label: '9. Gold Luxury Bracelet Watch',
    url: PRODUCT_IMAGES.watch9,
  },
  {
    label: '10. Gold Premium Edition Watch',
    url: PRODUCT_IMAGES.watch10,
  },
  {
    label: 'Royal Oud Perfume Studio',
    url: PRODUCT_IMAGES.perfumeRoyalOud,
  },
  {
    label: 'Amber Elixir Perfume Studio',
    url: PRODUCT_IMAGES.perfumeAmberElixir,
  },
];

export const CatalogAdminModal: React.FC<CatalogAdminModalProps> = ({
  isOpen,
  products,
  whatsappNumber,
  onUpdateWhatsappNumber,
  onSaveProduct,
  onDeleteProduct,
  onResetCatalog,
  onClose,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [waInput, setWaInput] = useState(whatsappNumber);
  const [waSaved, setWaSaved] = useState(false);

  if (!isOpen) return null;

  const startNewProduct = (type: 'watch' | 'perfume') => {
    const id = `${type}-${Date.now()}`;
    setEditingProduct({
      id,
      sku: `RTS-${type === 'watch' ? 'W' : 'P'}${Math.floor(300 + Math.random() * 600)}`,
      name: '',
      type,
      category: type === 'watch' ? "Men's Watches" : "Men's Perfumes",
      shortDescription: '',
      fullDescription: '',
      price: type === 'watch' ? 4200 : 3500,
      oldPrice: type === 'watch' ? 5200 : 4400,
      discountPercent: 19,
      image:
        type === 'watch'
          ? DEFAULT_IMAGES[0].url
          : DEFAULT_IMAGES[2].url,
      stockStatus: 'In Stock',
      sizes:
        type === 'watch'
          ? [
              { label: '40mm Standard', priceDelta: 0 },
              { label: '41mm + Luxury Box', priceDelta: 400 },
            ]
          : [
              { label: '50ml Flacon', priceDelta: 0 },
              { label: '100ml Flacon', priceDelta: 1000 },
            ],
      fragranceType: type === 'perfume' ? 'Eau de Parfum' : undefined,
      defaultSizeLabel: type === 'perfume' ? '50ml / 100ml' : undefined,
      movement: type === 'watch' ? 'Precision Quartz Calibre' : undefined,
      featured: true,
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name.trim()) return;
    onSaveProduct(editingProduct);
    setEditingProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121215] border border-white/15 rounded-2xl overflow-hidden shadow-2xl my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#16161A]">
          <div>
            <span className="text-xs text-[#D4AF37] font-medium block">
              Store Configuration &amp; Product Manager
            </span>
            <h2 id="admin-modal-title" className="font-display text-2xl font-semibold text-[#F5F3EF]">
              Manage Catalog &amp; WhatsApp Settings
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-white/10 text-[#9E9A90] hover:text-[#F5F3EF] inline-flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* WhatsApp Number Configuration */}
          <div className="p-4 rounded-xl bg-[#17171B] border border-white/10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-[#D4AF37] mb-1">
                Store WhatsApp Order Number (International Format without '+')
              </label>
              <input
                type="text"
                value={waInput}
                onChange={(e) => setWaInput(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="923116164092"
                className="w-full sm:max-w-xs h-10 px-3 rounded-lg bg-[#111114] border border-white/15 font-mono-num text-xs text-[#F5F3EF]"
              />
              <p className="text-[11px] text-[#8A857B] mt-1">
                Active number: <code className="text-[#C8C4BC]">03116164092</code> (International link format: <code className="text-[#C8C4BC]">923116164092</code>).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdateWhatsappNumber(waInput || '923116164092');
                  setWaSaved(true);
                  setTimeout(() => setWaSaved(false), 2000);
                }}
                className="h-10 px-4 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold hover:bg-[#E5C354] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{waSaved ? 'Saved!' : 'Update Number'}</span>
              </button>

              <button
                type="button"
                onClick={onResetCatalog}
                className="h-10 px-3.5 rounded-lg border border-white/15 text-xs text-[#C8C4BC] hover:text-[#F5F3EF] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Product Form or List */}
          {editingProduct ? (
            <form
              onSubmit={handleSaveForm}
              className="p-5 rounded-xl bg-[#17171B] border border-[#D4AF37]/40 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display text-xl font-semibold text-[#F5F3EF]">
                  {editingProduct.name ? `Edit: ${editingProduct.name}` : `Add New ${editingProduct.type === 'watch' ? 'Watch' : 'Perfume'}`}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-[#9E9A90] hover:text-[#F5F3EF]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const isWatch = cat.includes('Watch');
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        type: isWatch ? 'watch' : 'perfume',
                      });
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Stock Status</label>
                  <select
                    value={editingProduct.stockStatus}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stockStatus: e.target.value as StockStatus,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 font-mono-num text-xs text-[#F5F3EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Old Price (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.oldPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        oldPrice: Number(e.target.value) || undefined,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 font-mono-num text-xs text-[#F5F3EF]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">Discount Badge (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={editingProduct.discountPercent || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        discountPercent: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 font-mono-num text-xs text-[#F5F3EF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">
                    Image Path or URL
                  </label>
                  <input
                    type="text"
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9E9A90] mb-1">
                    Or Select Studio Preset Image
                  </label>
                  <select
                    value={editingProduct.image}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, image: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                  >
                    {DEFAULT_IMAGES.map((img) => (
                      <option key={img.url} value={img.url}>
                        {img.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9E9A90] mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.shortDescription}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9E9A90] mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.fullDescription}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      fullDescription: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-[#111114] border border-white/15 text-xs text-[#F5F3EF]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="h-10 px-4 rounded-lg border border-white/15 text-xs text-[#C8C4BC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold hover:bg-[#E5C354] cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#9E9A90]">
                  Showing {products.length} total products ({products.filter((p) => p.type === 'watch').length} watches, {products.filter((p) => p.type === 'perfume').length} perfumes)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startNewProduct('watch')}
                    className="h-9 px-3.5 rounded-lg bg-[#D4AF37] text-[#0B0B0C] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Watch
                  </button>
                  <button
                    type="button"
                    onClick={() => startNewProduct('perfume')}
                    className="h-9 px-3.5 rounded-lg border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Perfume
                  </button>
                </div>
              </div>

              <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden bg-[#16161A]">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02]"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#F5F3EF] truncate">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-[#9E9A90]">
                        {prod.category} · <span className="font-mono-num text-[#D4AF37]">{formatPKR(prod.price)}</span> · {prod.stockStatus}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(prod)}
                        className="px-2.5 py-1.5 rounded border border-white/15 text-xs text-[#E5E0D8] hover:border-[#D4AF37] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-1.5 rounded border border-white/10 text-[#8A857B] hover:text-red-400 cursor-pointer"
                        aria-label={`Delete ${prod.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
