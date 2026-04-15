import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import Link from 'next/link';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-none text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

interface ProductData {
  name: string;
  category: string;
  badge: string;
  reviews: string;
  price: string;
  rating: number;
  cardBg: string;
  badgeBg: string;
  badgeText: string;
  priceColor?: string;
}

function ProductCard({ product }: { product: ProductData }) {
  return (
    <div className="bg-white rounded-[10px] border border-gray-200 overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Rectángulo de color */}
      <div
        style={{ backgroundColor: product.cardBg }}
        className="relative h-40 w-full flex-shrink-0"
      >
        <span
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold ${product.badgeBg} ${product.badgeText}`}
        >
          {product.badge}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <p className="font-semibold text-gray-900 text-sm leading-snug">
          {product.name}
        </p>
        <p className="text-xs text-gray-400">{product.category}</p>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <p
          className="font-bold text-sm mt-1"
          style={product.priceColor ? { color: product.priceColor } : undefined}
        >
          {product.price}
        </p>
      </div>
    </div>
  );
}

export function ProductShowcase() {
  const t = useTranslations('Index');

  const products: ProductData[] = [
    {
      name: t('ps_p1_name'),
      category: t('ps_p1_category'),
      badge: t('ps_p1_badge'),
      reviews: t('ps_p1_reviews'),
      price: t('ps_p1_price'),
      rating: 5,
      cardBg: '#e8edf5',
      badgeBg: 'bg-yellow-100',
      badgeText: 'text-yellow-800',
    },
    {
      name: t('ps_p2_name'),
      category: t('ps_p2_category'),
      badge: t('ps_p2_badge'),
      reviews: t('ps_p2_reviews'),
      price: t('ps_p2_price'),
      rating: 4,
      cardBg: '#f0f7ff',
      badgeBg: 'bg-blue-100',
      badgeText: 'text-blue-700',
    },
    {
      name: t('ps_p3_name'),
      category: t('ps_p3_category'),
      badge: t('ps_p3_badge'),
      reviews: t('ps_p3_reviews'),
      price: t('ps_p3_price'),
      rating: 5,
      cardBg: '#f0fdf4',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
    },
    {
      name: t('ps_p4_name'),
      category: t('ps_p4_category'),
      badge: t('ps_p4_badge'),
      reviews: t('ps_p4_reviews'),
      price: t('ps_p4_price'),
      rating: 5,
      cardBg: '#fdf4ff',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-700',
      priceColor: '#9333ea',
    },
  ];

  return (
    <section className="w-full bg-[#f5f5f7] py-16">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[22px] font-bold text-gray-900">
            {t('ps_title')}
          </h2>
          <Link
            href="/tienda"
            className="text-sm font-medium text-primary hover:opacity-75 transition-opacity"
          >
            {t('ps_cta')} →
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, idx) => (
            <ProductCard key={idx} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
