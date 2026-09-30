/**
 * ============================================================================
 * ROYAL TIME & SCENTS — STORE CONFIGURATION & PRODUCT CATALOG
 * ============================================================================
 * Edit this file to update the WhatsApp ordering number, store contact details,
 * categories, or to add, remove, and modify watches and perfumes.
 */

import watch1Img from '../assets/images/watch_1_rado_gold_classic_1790797268751.jpg';
import watch2Img from '../assets/images/watch_2_rado_gold_diamond_dial_1790797316999.jpg';
import watch3Img from '../assets/images/watch_3_rado_gold_premium_1790797328581.jpg';
import watch4Img from '../assets/images/watch_4_gold_luxury_style_1790797341049.jpg';
import watch5Img from '../assets/images/watch_5_gold_classic_chain_1790797355116.jpg';
import watch6Img from '../assets/images/watch_6_gold_elegant_dial_1790797366555.jpg';
import watch7Img from '../assets/images/watch_7_rado_premium_gold_1790797377055.jpg';
import watch8Img from '../assets/images/watch_8_gold_stone_dial_1790797388246.jpg';
import watch9Img from '../assets/images/watch_9_gold_luxury_bracelet_1790797398832.jpg';
import watch10Img from '../assets/images/watch_10_gold_premium_edition_1790797409988.jpg';
import perfumeRoyalOudImg from '../assets/images/perfume_royal_oud_1790794441957.jpg';
import perfumeAmberElixirImg from '../assets/images/perfume_amber_elixir_1790794452229.jpg';
import heroWatchPerfumeImg from '../assets/images/hero_watch_perfume_1790794402875.jpg';

export const PRODUCT_IMAGES = {
  watch1: watch1Img,
  watch2: watch2Img,
  watch3: watch3Img,
  watch4: watch4Img,
  watch5: watch5Img,
  watch6: watch6Img,
  watch7: watch7Img,
  watch8: watch8Img,
  watch9: watch9Img,
  watch10: watch10Img,
  perfumeRoyalOud: perfumeRoyalOudImg,
  perfumeAmberElixir: perfumeAmberElixirImg,
  heroWatchPerfume: heroWatchPerfumeImg,
};

export const STORE_CONFIG = {
  brandName: 'Royal Time & Scents',
  ownerName: 'Hafiz Haider',
  tagline: 'Timeless Watches. Signature Scents.',
  /**
   * WhatsApp number in international format (without '+' or spaces) for wa.me links:
   * 923116164092 (Local display: 03116164092)
   */
  whatsappNumber: '923116164092',
  whatsappDisplay: '03116164092',
  phoneDisplay: '03116164092',
  email: 'concierge@royaltimeandscents.pk',
  facebookUrl: 'https://facebook.com/royaltimeandscents',
  instagramHandle: '@royaltimeandscents.pk',
  instagramUrl: 'https://instagram.com/royaltimeandscents.pk',
  storeAddress: 'Boutique 14, MM Alam Road, Gulberg III, Lahore, Pakistan',
  currency: 'PKR',
  freeDeliveryThreshold: 4000,
  standardDeliveryFee: 250,
  heroImage: watch1Img,
};

export type ProductType = 'watch' | 'perfume';

export type ProductCategory =
  | "Men's Watches"
  | "Women's Watches"
  | 'Luxury Watches'
  | "Men's Perfumes"
  | "Women's Perfumes"
  | 'Unisex Fragrances';

export type StockStatus = 'In Stock' | 'Limited Stock' | 'Out of Stock';

export interface ProductSizeOption {
  label: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  category: ProductCategory;
  replicaLabel?: string; // e.g., "Replica / Copy"
  shortDescription: string;
  fullDescription: string;
  price: number; // Current price in PKR
  oldPrice?: number; // Original price in PKR before discount
  discountPercent?: number;
  image: string;
  imageStyle?: string;
  stockStatus: StockStatus;
  sizes: ProductSizeOption[];
  // Watch-specific fields
  movement?: string;
  caseMaterial?: string;
  waterResistance?: string;
  // Perfume-specific fields
  fragranceType?: string;
  defaultSizeLabel?: string;
  scentNotes?: {
    top: string;
    heart: string;
    base: string;
  };
  featured?: boolean;
  isSpecialOffer?: boolean;
}

export interface CategoryInfo {
  id: ProductCategory;
  title: ProductCategory;
  group: 'Watches' | 'Perfumes';
  subtitle: string;
  itemCountLabel: string;
  image: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "Men's Watches",
    title: "Men's Watches",
    group: 'Watches',
    subtitle: 'Rado-style gold classic & chain replica/copy watches',
    itemCountLabel: 'PKR 2,400 – 4,500',
    image: watch1Img,
  },
  {
    id: "Women's Watches",
    title: "Women's Watches",
    group: 'Watches',
    subtitle: 'Gold diamond dial & stone bracelet replica/copy watches',
    itemCountLabel: 'PKR 2,800 – 5,400',
    image: watch2Img,
  },
  {
    id: 'Luxury Watches',
    title: 'Luxury Watches',
    group: 'Watches',
    subtitle: 'Rado-style premium gold & stone-dial replica/copy editions',
    itemCountLabel: 'PKR 3,800 – 5,800',
    image: watch8Img,
  },
  {
    id: "Men's Perfumes",
    title: "Men's Perfumes",
    group: 'Perfumes',
    subtitle: 'Smoky Cambodian oud, spiced leather & cedarwood extraits',
    itemCountLabel: 'Extrait & Eau de Parfum',
    image: perfumeRoyalOudImg,
  },
  {
    id: "Women's Perfumes",
    title: "Women's Perfumes",
    group: 'Perfumes',
    subtitle: 'Damask rose, saffron nectar, white jasmine & cashmere musk',
    itemCountLabel: 'Floral & Amber Elixirs',
    image: perfumeAmberElixirImg,
  },
  {
    id: 'Unisex Fragrances',
    title: 'Unisex Fragrances',
    group: 'Perfumes',
    subtitle: 'Artisanal ambergris, imperial saffron & velvet sandalwood',
    itemCountLabel: 'Signature Niche Blends',
    image: perfumeRoyalOudImg,
  },
];

/**
 * INITIAL PRODUCT CATALOG
 * 10 Gold & Rado-Style Replica/Copy Watches (PKR 2,400 – PKR 5,800) + 8 Signature Perfumes
 */
export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================================================
  // 10 UPLOADED WATCH COLLECTION PRODUCTS (Replica / Copy — PKR 2,400 to PKR 5,800)
  // ==========================================================================
  {
    id: 'watch-01',
    sku: 'RTS-W101',
    name: 'Rado Style Gold Classic Watch',
    type: 'watch',
    category: "Men's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Oval polished gold bezel with textured champagne dial, red emblem at 12 o’clock, and day-date display.',
    fullDescription:
      'Replica / Copy edition featuring the iconic Rado DiaStar-inspired oval gold bezel, textured champagne-gold dial with stone markers, angled day-date window at 6 o’clock, and a comfortable gold-tone link chain bracelet.',
    price: 3200,
    oldPrice: 4000,
    discountPercent: 20,
    image: watch1Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Polished Gold-Tone Oval Case & Chain',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-02',
    sku: 'RTS-W102',
    name: 'Rado Style Gold Diamond Dial Watch',
    type: 'watch',
    category: "Women's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Smooth champagne gold dial accented with crystal stone hour markers and polished gold oval case.',
    fullDescription:
      'Replica / Copy edition crafted with a mirror-polished oval gold bezel, clean champagne dial set with sparkling crystal hour markers, red emblem at 12 o’clock, and a gold-tone stainless steel bracelet.',
    price: 3600,
    oldPrice: 4500,
    discountPercent: 20,
    image: watch2Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Precision Quartz Movement (Replica / Copy)',
    caseMaterial: 'Gold-Tone Oval Bezel & Link Bracelet',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-03',
    sku: 'RTS-W103',
    name: 'Rado Style Gold Premium Watch',
    type: 'watch',
    category: 'Luxury Watches',
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Sunburst fluted gold dial with crystal indices, date window at 6 o’clock, and oval gold bezel.',
    fullDescription:
      'Replica / Copy edition showcasing a radiant sunburst-textured gold dial, crystal stone hour markers, date aperture at 6 o’clock, and a heavy gold-tone link chain bracelet.',
    price: 4200,
    oldPrice: 5200,
    discountPercent: 19,
    image: watch3Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Date Movement (Replica / Copy)',
    caseMaterial: 'Polished Gold-Tone Case & Bracelet',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-04',
    sku: 'RTS-W104',
    name: 'Gold Luxury Style Watch',
    type: 'watch',
    category: 'Luxury Watches',
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Circular silver crystal ring dial pattern with red stone indices and vertical day-date window.',
    fullDescription:
      'Replica / Copy edition featuring an eye-catching silver crystal ring motif across a golden dial, red stone hour markers, vertical day-date window at 6 o’clock, and a classic gold-tone chain.',
    price: 3800,
    oldPrice: 4700,
    discountPercent: 19,
    image: watch4Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Gold-Tone Oval Bezel & Chain',
    waterResistance: 'Splash Resistant',
    featured: true,
  },
  {
    id: 'watch-05',
    sku: 'RTS-W105',
    name: 'Gold Classic Chain Watch',
    type: 'watch',
    category: "Men's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Silver crystal-paved dial with blue stone markers, vertical day-date window, and gold chain.',
    fullDescription:
      'Replica / Copy edition combining an affordable everyday price with a shimmering silver crystal-textured dial, contrasting blue stone markers, vertical day-date display, and a classic gold-tone chain.',
    price: 2400,
    oldPrice: 3000,
    discountPercent: 20,
    image: watch5Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Gold-Tone Case & Link Chain',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-06',
    sku: 'RTS-W106',
    name: 'Gold Elegant Dial Watch',
    type: 'watch',
    category: "Women's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Champagne gold dial with twin curved crystal stone arcs, red markers, and gold bracelet.',
    fullDescription:
      'Replica / Copy edition designed with graceful curved silver crystal arcs across a warm golden dial, red stone hour markers, day-date window at 6 o’clock, and a polished gold-tone bracelet.',
    price: 2800,
    oldPrice: 3500,
    discountPercent: 20,
    image: watch6Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Polished Gold-Tone Oval Case',
    waterResistance: 'Splash Resistant',
    featured: true,
  },
  {
    id: 'watch-07',
    sku: 'RTS-W107',
    name: 'Rado Style Premium Gold Watch',
    type: 'watch',
    category: "Men's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Brushed and polished oval gold bezel with red square stone markers and curved crystal lines.',
    fullDescription:
      'Replica / Copy edition featuring a bold satin-gold oval bezel, champagne dial with red square stone hour indices, twin crystal stone curves, and a sturdy gold-tone link bracelet.',
    price: 4500,
    oldPrice: 5500,
    discountPercent: 18,
    image: watch7Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Movement (Replica / Copy)',
    caseMaterial: 'Satin & Polished Gold-Tone Steel Finish',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-08',
    sku: 'RTS-W108',
    name: 'Gold Stone Dial Watch',
    type: 'watch',
    category: 'Luxury Watches',
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Faceted gold bezel with vertical gold-glitter stripes, crystal stone arcs, and MON 17 day-date.',
    fullDescription:
      'Replica / Copy edition crafted for weddings and festive occasions across Pakistan. Features a faceted oval gold bezel, vertical gold-glitter striped dial with crystal stone curves, red hour markers, and vertical day-date display.',
    price: 4900,
    oldPrice: 6000,
    discountPercent: 18,
    image: watch8Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Faceted Gold-Tone Bezel & Bracelet',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'watch-09',
    sku: 'RTS-W109',
    name: 'Gold Luxury Bracelet Watch',
    type: 'watch',
    category: "Women's Watches",
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Classic yellow-gold dial with square crystal diamond markers and vertical FRI 15 day-date window.',
    fullDescription:
      'Replica / Copy edition combining a timeless yellow-gold dial, 11 square crystal diamond hour markers, vertical day-date window at 6 o’clock, and a high-shine gold-tone link bracelet.',
    price: 5400,
    oldPrice: 6600,
    discountPercent: 18,
    image: watch9Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'In Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Gift Box', priceDelta: 300 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'High-Polish Gold-Tone Case & Bracelet',
    waterResistance: 'Splash Resistant',
    featured: true,
  },
  {
    id: 'watch-10',
    sku: 'RTS-W110',
    name: 'Gold Premium Edition Watch',
    type: 'watch',
    category: 'Luxury Watches',
    replicaLabel: 'Replica / Copy',
    shortDescription: 'Full gold-glitter pavé dial with blue stone markers, vertical SAT 13 day-date, and heavy gold chain.',
    fullDescription:
      'Our flagship Replica / Copy gold edition. Features a rich gold-glitter pavé dial accented with deep blue stone hour markers, red emblem at 12 o’clock, vertical day-date window at 6 o’clock, and a heavy gold-tone chain.',
    price: 5800,
    oldPrice: 7000,
    discountPercent: 17,
    image: watch10Img,
    imageStyle: 'scale-105 object-center',
    stockStatus: 'Limited Stock',
    sizes: [
      { label: 'Standard Size', priceDelta: 0 },
      { label: 'With Luxury Box', priceDelta: 0 },
    ],
    movement: 'Quartz Day-Date Movement (Replica / Copy)',
    caseMaterial: 'Heavy Gold-Tone Oval Case & Chain',
    waterResistance: 'Splash Resistant',
    featured: true,
    isSpecialOffer: true,
  },

  // ==========================================================================
  // 8 PERFUME PRODUCTS
  // ==========================================================================
  {
    id: 'perfume-01',
    sku: 'RTS-P201',
    name: 'Oud Al-Sultaniyah',
    type: 'perfume',
    category: "Men's Perfumes",
    shortDescription: 'Aged Cambodian agarwood, smoky frankincense, and dark roasted Madagascar vanilla.',
    fullDescription:
      'Crafted with 30% pure fragrance oil concentration, Oud Al-Sultaniyah commands attention for over 14 hours. Perfectly suited for winter evenings, weddings, and formal gatherings across Pakistan.',
    price: 3800,
    oldPrice: 4800,
    discountPercent: 20,
    image: perfumeRoyalOudImg,
    imageStyle: 'brightness-100 contrast-105',
    stockStatus: 'In Stock',
    fragranceType: 'Extrait de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1200 },
    ],
    scentNotes: {
      top: 'Kashmiri Saffron, Black Cardamom & Bergamot',
      heart: 'Smoky Cambodian Oud, Moroccan Leather & Incense',
      base: 'Dark Ambergris, Patchouli & Roasted Vanilla Bean',
    },
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'perfume-02',
    sku: 'RTS-P202',
    name: 'Ambre Impérial Elixir',
    type: 'perfume',
    category: 'Unisex Fragrances',
    shortDescription: 'Luminous golden amber resin blended with warm cinnamon bark, honeyed labdanum, and tonka.',
    fullDescription:
      'An opulent unisex signature that wraps the wearer in liquid gold warmth. Ambre Impérial Elixir balances bright Mediterranean citrus with deep resinous amber and creamy sandalwood.',
    price: 3400,
    oldPrice: 4200,
    discountPercent: 19,
    image: perfumeAmberElixirImg,
    imageStyle: 'brightness-100 contrast-105',
    stockStatus: 'In Stock',
    fragranceType: 'Eau de Parfum Intense',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1000 },
    ],
    scentNotes: {
      top: 'Ceylon Cinnamon, Blood Orange & Pink Pepper',
      heart: 'Golden Labdanum, Benzoin Resin & Turkish Rose',
      base: 'Roasted Tonka Bean, Mysore Sandalwood & White Musk',
    },
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'perfume-03',
    sku: 'RTS-P203',
    name: 'Velours de Rose & Safran',
    type: 'perfume',
    category: "Women's Perfumes",
    shortDescription: 'Velvety Damask rose petals infused with golden saffron, lychee, and cashmere woods.',
    fullDescription:
      'Radiant, romantic, and unforgettable. Velours de Rose opens with dewy crimson rose and sparkling bergamot before settling into a sensual veil of white amber and praline.',
    price: 3200,
    oldPrice: 4000,
    discountPercent: 20,
    image: perfumeAmberElixirImg,
    imageStyle: 'scale-105 brightness-105 saturate-110',
    stockStatus: 'In Stock',
    fragranceType: 'Eau de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1000 },
    ],
    scentNotes: {
      top: 'Juicy Lychee, Red Saffron & Italian Bergamot',
      heart: 'Damask Rose Absolute, Peony & Jasmine Sambac',
      base: 'Cashmere Wood, Velvet Musk & Warm Praline',
    },
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'perfume-04',
    sku: 'RTS-P204',
    name: 'Noir Cuir & Vétiver Sauvage',
    type: 'perfume',
    category: "Men's Perfumes",
    shortDescription: 'Crisp Haitian vetiver, Calabrian bergamot, Tuscan suede leather, and ambroxan.',
    fullDescription:
      'Tailored for Pakistan’s warm afternoons and executive environments, Noir Cuir & Vétiver delivers a crisp, aristocratic trail of smoky woods, pepper, and refined leather.',
    price: 2900,
    oldPrice: 3600,
    discountPercent: 19,
    image: perfumeRoyalOudImg,
    imageStyle: 'scale-105 contrast-110',
    stockStatus: 'In Stock',
    fragranceType: 'Eau de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 900 },
    ],
    scentNotes: {
      top: 'Sicilian Grapefruit, Juniper Berry & Bergamot',
      heart: 'Tuscan Black Leather, Pink Pepper & Clary Sage',
      base: 'Haitian Vetiver, Ambroxan & Atlas Cedar',
    },
    featured: true,
  },
  {
    id: 'perfume-05',
    sku: 'RTS-P205',
    name: 'Jasmin d’Or & Musc Blanc',
    type: 'perfume',
    category: "Women's Perfumes",
    shortDescription: 'Night-blooming Arabian jasmine, orange blossom nectar, and silky white musk.',
    fullDescription:
      'Inspired by Lahore’s fragrant summer gardens at dusk, Jasmin d’Or wraps luminous white florals in a clean, powdery base of golden honey and sandalwood.',
    price: 2800,
    oldPrice: 3500,
    discountPercent: 20,
    image: perfumeAmberElixirImg,
    imageStyle: 'brightness-110 contrast-100',
    stockStatus: 'In Stock',
    fragranceType: 'Eau de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 900 },
    ],
    scentNotes: {
      top: 'Mandarin Blossom, Neroli & White Peach',
      heart: 'Arabian Jasmine, Tuberose & Ylang-Ylang',
      base: 'Silky White Musk, Bourbon Vanilla & Sandalwood',
    },
    featured: true,
  },
  {
    id: 'perfume-06',
    sku: 'RTS-P206',
    name: 'Baccarat Safran Royal 540',
    type: 'perfume',
    category: 'Unisex Fragrances',
    shortDescription: 'Spun sugar crystal, saffron threads, fir balsam, and mineral ambergris.',
    fullDescription:
      'Our most requested unisex fragrance in Karachi, Lahore, and Islamabad. Baccarat Safran Royal projects an airy yet hypnotic aura of burnt sugar, saffron spice, and coastal ambergris.',
    price: 4200,
    oldPrice: 5200,
    discountPercent: 19,
    image: heroWatchPerfumeImg,
    imageStyle: 'object-right scale-105 contrast-105',
    stockStatus: 'Limited Stock',
    fragranceType: 'Extrait de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1200 },
    ],
    scentNotes: {
      top: 'Iranian Saffron & Egyptian Grandiflorum Jasmine',
      heart: 'Bitter Almond, Spun Amber & Cedarwood Heart',
      base: 'Mineral Ambergris, Fir Resin & Woody Musk',
    },
    featured: true,
    isSpecialOffer: true,
  },
  {
    id: 'perfume-07',
    sku: 'RTS-P207',
    name: 'Sultan’s Majlis Smoked Oud',
    type: 'perfume',
    category: "Men's Perfumes",
    shortDescription: 'Intense Hindi oud, roasted coffee bean, black pepper, and dark patchouli.',
    fullDescription:
      'A bold, unapologetically masculine extrait crafted for connoisseurs of oriental perfumery. Leaves a commanding sillage that lingers on fabric for days.',
    price: 4500,
    oldPrice: 5500,
    discountPercent: 18,
    image: perfumeRoyalOudImg,
    imageStyle: 'brightness-95 contrast-115',
    stockStatus: 'In Stock',
    fragranceType: 'Extrait de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1200 },
    ],
    scentNotes: {
      top: 'Crushed Black Pepper, Roasted Arabica & Cardamom',
      heart: 'Assam Hindi Oud, Bulgarian Rose & Frankincense',
      base: 'Dark Patchouli, Leather Accord & Guaiac Wood',
    },
    featured: true,
  },
  {
    id: 'perfume-08',
    sku: 'RTS-P208',
    name: 'Aventus Creed-Style Royal Pineapple & Birch',
    type: 'perfume',
    category: 'Unisex Fragrances',
    shortDescription: 'Smoky birchwood, fresh pineapple, blackcurrant, and oakmoss executive blend.',
    fullDescription:
      'Effortlessly modern and versatile for year-round wear in Pakistan. Fuses bright fruity-citrus top notes with a smoky, woody dry-down that projects confidence.',
    price: 3500,
    oldPrice: 4400,
    discountPercent: 20,
    image: perfumeAmberElixirImg,
    imageStyle: 'contrast-105 saturate-95',
    stockStatus: 'In Stock',
    fragranceType: 'Eau de Parfum',
    defaultSizeLabel: '50ml / 100ml',
    sizes: [
      { label: '50ml Flacon', priceDelta: 0 },
      { label: '100ml Flacon', priceDelta: 1000 },
    ],
    scentNotes: {
      top: 'Bergamot, Blackcurrant Leaves & Pineapple',
      heart: 'Smoky Birch, Moroccan Jasmine & Patchouli',
      base: 'Oakmoss, Ambergris & Musk',
    },
    featured: true,
  },
];

export interface CustomerReview {
  id: string;
  customerName: string;
  city: string;
  role: string;
  rating: number;
  productPurchased: string;
  comment: string;
  date: string;
}

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    customerName: 'Hamza Tariq Awan',
    city: 'DHA Phase 6, Lahore',
    role: 'Verified Buyer',
    rating: 5,
    productPurchased: 'Rado Style Gold Classic Watch (PKR 3,200)',
    comment:
      'Ordered the Rado Style Gold Classic Watch on WhatsApp (03116164092) from Hafiz Haider and received it in Lahore the very next afternoon. For a replica/copy watch at PKR 3,200, the gold shine and day-date dial look amazing.',
    date: 'August 2026',
  },
  {
    id: 'rev-2',
    customerName: 'Dr. Ayesha Sikandar',
    city: 'Clifton Block 4, Karachi',
    role: 'Verified Buyer',
    rating: 5,
    productPurchased: 'Rado Style Gold Diamond Dial Watch & Velours de Rose',
    comment:
      'The Rado Style Gold Diamond Dial Watch is so sleek on the wrist, and Velours de Rose lasts all day in Karachi. Honest replica/copy pricing and very fast Cash on Delivery!',
    date: 'September 2026',
  },
  {
    id: 'rev-3',
    customerName: 'Zain-ul-Abideen Shah',
    city: 'F-7/2, Islamabad',
    role: 'Verified Buyer',
    rating: 5,
    productPurchased: 'Gold Stone Dial Watch & Oud Al-Sultaniyah',
    comment:
      'The Gold Stone Dial Watch looks super classy with shalwar kameez and formal wear at just PKR 4,900, and Oud Al-Sultaniyah is my go-to evening scent. Great service!',
    date: 'September 2026',
  },
  {
    id: 'rev-4',
    customerName: 'Maham & Daniyal Qureshi',
    city: 'Peoples Colony, Faisalabad',
    role: 'Verified Gift Buyers',
    rating: 5,
    productPurchased: 'Gold Premium Edition Watch & Baccarat Safran Royal',
    comment:
      'We ordered the Gold Premium Edition Watch and Baccarat Safran Royal via WhatsApp as a wedding gift. Hafiz Haider responded on 03116164092 within minutes and packed everything neatly.',
    date: 'September 2026',
  },
];

export const PAKISTAN_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Gujranwala',
  'Sialkot',
  'Quetta',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Hyderabad',
];

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString('en-PK')}`;
}

/**
 * Helper to generate a pre-filled WhatsApp order URL for 923116164092
 * containing all 6 required fields:
 * - Customer name
 * - Product name
 * - Quantity
 * - Price
 * - City
 * - Complete address
 */
export function buildWhatsAppOrderMessage(params: {
  customerName?: string;
  productName: string;
  quantity: number;
  priceFormatted: string;
  city?: string;
  completeAddress?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  orderNotes?: string;
}): string {
  const lines = [
    `*New Order — ${STORE_CONFIG.brandName}*`,
    `----------------------------------`,
    `*Customer Name:* ${params.customerName?.trim() || '[Please enter your Full Name]'}`,
    `*Product Name:* ${params.productName}`,
    `*Quantity:* ${params.quantity}`,
    `*Price:* ${params.priceFormatted}`,
    `*City:* ${params.city?.trim() || '[Please enter your City]'}`,
    `*Complete Address:* ${params.completeAddress?.trim() || '[Please enter your Complete Delivery Address]'}`,
  ];

  if (params.phoneNumber?.trim()) {
    lines.push(`*Phone Number:* ${params.phoneNumber.trim()}`);
  }
  if (params.whatsappNumber?.trim()) {
    lines.push(`*WhatsApp Number:* ${params.whatsappNumber.trim()}`);
  }
  if (params.orderNotes?.trim()) {
    lines.push(`*Order Notes:* ${params.orderNotes.trim()}`);
  }

  lines.push(`----------------------------------`);
  lines.push(`Please confirm my Cash on Delivery order.`);
  return lines.join('\n');
}

export function buildWhatsAppOrderUrl(
  targetWhatsAppNumber: string,
  params: Parameters<typeof buildWhatsAppOrderMessage>[0]
): string {
  const cleanNumber = targetWhatsAppNumber.replace(/[^0-9]/g, '') || STORE_CONFIG.whatsappNumber;
  const msg = buildWhatsAppOrderMessage(params);
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Crops an uploaded watch image file into a clean 1:1 square centered on the watch
 * while trimming out bottom/corner phone numbers or seller watermarks.
 */
export function cropWatchImageToSquareDataUrl(file: File, trimBottomWatermark = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetSize = 720;
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Crop a slightly zoomed center-top square (86% of shortest dimension)
        // so any bottom phone numbers (+91...) or corner logos are cleanly cropped out
        // without distorting the watch aspect ratio.
        const minSide = Math.min(img.width, img.height);
        const cropFactor = trimBottomWatermark ? 0.86 : 0.96;
        const cropSize = minSide * cropFactor;
        const sx = (img.width - cropSize) / 2;
        const sy = Math.max(0, (img.height - cropSize) * 0.38);

        ctx.drawImage(img, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
