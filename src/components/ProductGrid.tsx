import { Heart, Package, ShoppingCartPlus } from 'lucide-react';
import type { Product } from '../types';
import { money } from '../lib/format';

export function ProductGrid({ products, onProduct, onAdd, favorites = [], onToggleFavorite, compactActions = false, columns = 'md:grid-cols-2 lg:grid-cols-3' }: {
  products: Product[];
  onProduct: (id: number) => void;
  onAdd: (product: Product) => void;
  favorites?: number[];
  onToggleFavorite?: (id: number) => void;
  compactActions?: boolean;
  columns?: string;
}) {
  return (
    <div className={`grid grid-cols-1 ${columns} gap-8`}>
      {products.map((product) => (
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-secondary/20 dark:border-secondary/30 group hover:-translate-y-2 cursor-pointer relative flex flex-col" key={product.id} onClick={() => onProduct(product.id)}>
          {product.previous_price && product.previous_price > product.price && <div className="sale-badge">Sale</div>}
          <figure className="aspect-square overflow-hidden relative">
            <img src={product.images[0]} alt={product.name} loading="eager" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
            {product.stock === 0 && <figcaption className="absolute inset-x-0 bottom-0 bg-gray-900/85 text-white text-sm font-semibold text-center py-2">Out of stock</figcaption>}
          </figure>
          <div className="p-6 bg-gradient-to-b from-white to-cream/50 dark:from-gray-800 dark:to-gray-900 flex flex-col flex-grow">
            <header className="flex-grow">
              <h3 className="text-lg font-semibold text-primary dark:text-primary-light mb-2">{product.name || 'Untitled Product'}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
            </header>
            <footer className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-secondary dark:text-secondary-light">{money(product.price || 0)}</span>
                {product.previous_price && product.previous_price > product.price && <div className="flex items-center gap-2 mt-1"><span className="text-sm text-gray-500 dark:text-gray-400 line-through">{money(product.previous_price)}</span><span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-full font-medium">-{Math.round(((product.previous_price - product.price) / product.previous_price) * 100)}%</span></div>}
              </div>
              <nav className={`flex ${compactActions ? 'gap-0' : 'gap-1'}`}>
                <button onClick={(event) => { event.stopPropagation(); onProduct(product.id); }} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-primary dark:text-primary-light hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 cursor-pointer" aria-label="View product"><Package className="h-5 w-5" /></button>
                <button disabled={product.stock === 0} onClick={(event) => { event.stopPropagation(); onAdd(product); }} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-secondary dark:text-secondary-light hover:bg-secondary/10 dark:hover:bg-secondary/20 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent" aria-label="Add to cart"><ShoppingCartPlus className="h-5 w-5" /></button>
                {onToggleFavorite && <button onClick={(event) => { event.stopPropagation(); onToggleFavorite(product.id); }} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${favorites.includes(product.id) ? 'text-rose-500 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400'}`} aria-label={favorites.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}><Heart className="h-5 w-5" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button>}
              </nav>
            </footer>
          </div>
        </article>
      ))}
    </div>
  );
}
