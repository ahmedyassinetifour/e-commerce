/// <reference types="vite/client" />
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowDown, ArrowLeft, Heart, Mail, MapPin, Menu, Minus, Moon, Package, Phone, Plus, Search, ShoppingCart, ShoppingCartPlus, Sun, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { CartLine, Product, View } from './types';
import { money } from './lib/format';
import type { AppDispatch, RootState } from './store/store';
import { addToCart, toggleFavorite, updateQuantity } from './store/cartSlice';
import { ProductGrid as ProductGridComponent } from './components/ProductGrid';
import { CartDrawer as CartDrawerComponent } from './components/CartDrawer';
import { Contact as ContactPage } from './pages/Contact';
import { InfoPage as InfoPageComponent } from './pages/InfoPage';

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;


function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return {
    path,
    go: (next: string) => {
      window.history.pushState({}, '', next);
      setPath(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  };
}

export function App() {
  const { path, go } = usePath();
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const cart = useSelector((state: RootState) => state.cart.items);
  const favorites = useSelector((state: RootState) => state.cart.favorites);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name-asc');
  const [saleOnly, setSaleOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('fanuna.theme') === 'dark');

  useEffect(() => {
    fetch(assetUrl('data/products.json'))
      .then((response) => {
        if (!response.ok) throw new Error('Could not load catalog');
        return response.json() as Promise<Product[]>;
      })
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => localStorage.setItem('fanuna.cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('fanuna.favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('fanuna.theme', dark ? 'dark' : 'light');
  }, [dark]);

  const add = (product: Product) => {
    dispatch(addToCart(product));
    setCartOpen(true);
  };
  const changeQuantity = (id: number, amount: number) => dispatch(updateQuantity({ id, amount }));
  const toggleFavoriteProduct = (id: number) => dispatch(toggleFavorite(id));
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filtered = products
    .filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()))
    .filter((p) => !category || p.category === category)
    .filter((p) => !saleOnly || (p.previous_price && p.previous_price > p.price))
    .filter((p) => !favoritesOnly || favorites.includes(p.id))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const selectedId = Number(path.split('/')[2]);
  const selected = products.find((p) => p.id === selectedId);
  const relatedProducts = selected
    ? products.filter((item) => item.id !== selected.id && item.category === selected.category).slice(0, 4)
    : [];
  const infoSlugs = ['about', 'faq', 'shipping', 'returns', 'privacy'];
  const view: View =
    path === '/products'
      ? 'products'
      : path === '/contact'
        ? 'contact'
        : path.startsWith('/product/')
          ? 'product'
          : infoSlugs.includes(path.slice(1))
            ? 'page'
            : 'home';

  return (
    <div className="min-h-screen bg-cream text-primary dark:bg-gray-900 dark:text-gray-100">
      <header className="site-header fixed top-0 left-0 w-full z-50 shadow-sm bg-cream/90 dark:bg-gray-800/90 border-b border-secondary/20 dark:border-secondary/30 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <button
              className="flex items-center md:justify-self-start"
              onClick={() => go('/')}
              aria-label="Fanuna home"
            >
              <img src={assetUrl('logo1.png')} alt="Fanuna" className="h-15 w-auto" />
            </button>
            <nav className="hidden md:flex md:justify-self-center items-center">
              <button
                className="inline-flex min-h-11 items-center px-3 rounded-lg text-primary dark:text-primary-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                onClick={() => go('/')}
              >
                Home
              </button>
              <button
                className="inline-flex min-h-11 items-center px-3 rounded-lg text-primary dark:text-primary-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                onClick={() => go('/products')}
              >
                Products
              </button>
              <button
                className="inline-flex min-h-11 items-center px-3 rounded-lg text-primary dark:text-primary-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                onClick={() => go('/contact')}
              >
                Contact
              </button>
            </nav>
            <div className="flex items-center gap-1 md:justify-self-end">
            <button
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-secondary dark:text-secondary-light hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-300 md:justify-self-end"
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 size-5 bg-primary text-white text-[10px] font-bold leading-none rounded-full inline-flex items-center justify-center text-center animate-pulse">
                  {count}
                </span>
              )}
            </button>
            <button className="icon-button theme-toggle" onClick={() => setDark((value) => !value)} aria-label="Toggle color theme">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button className="icon-button mobile-menu-toggle" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Open menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && <nav className="mobile-nav" aria-label="Mobile navigation">
          <button onClick={() => { go('/'); setMobileMenuOpen(false); }}>Home</button>
          <button onClick={() => { go('/products'); setMobileMenuOpen(false); }}>Products</button>
          <button onClick={() => { go('/contact'); setMobileMenuOpen(false); }}>Contact</button>
          <button onClick={() => setDark((value) => !value)}>{dark ? 'Light mode' : 'Dark mode'}</button>
        </nav>}
      </header>

      <main className="pt-16">
        {view === 'home' && (
          <Home
            products={products}
            onShop={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}
            onViewAll={() => go('/products')}
            onContact={() => go('/contact')}
            onProduct={(id) => go(`/product/${id}`)}
            onAdd={add}
            favorites={favorites}
            onToggleFavorite={toggleFavoriteProduct}
          />
        )}
        {view === 'products' && (
          <Products
            products={filtered}
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            categories={categories}
            sort={sort}
            setSort={setSort}
            saleOnly={saleOnly}
            setSaleOnly={setSaleOnly}
            favoritesOnly={favoritesOnly}
            setFavoritesOnly={setFavoritesOnly}
            onProduct={(id) => go(`/product/${id}`)}
            onAdd={add}
            favorites={favorites}
            onToggleFavorite={toggleFavoriteProduct}
          />
        )}
        {view === 'product' && selected && (
          <ProductPage
            product={selected}
            relatedProducts={relatedProducts.length > 0 ? relatedProducts : products.filter((item) => item.id !== selected.id).slice(0, 4)}
            onBack={() => go('/products')}
            onProduct={(id) => go(`/product/${id}`)}
            onAdd={add}
            isFavorite={favorites.includes(selected.id)}
            onToggleFavorite={toggleFavoriteProduct}
          />
        )}
        {view === 'contact' && <ContactPage />}
        {view === 'page' && <InfoPageComponent slug={path.slice(1)} />}
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <section className="md:col-span-2 text-center md:text-start">
            <img
              src={assetUrl('logo1.png')}
              alt="Fanuna"
              className="h-15 w-auto object-contain mx-auto md:mx-0 mb-4"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto md:mx-0">
              Discover unique handcrafted and personalized products, made with love and attention to detail.
            </p>
          </section>
          <section>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick links</h3>
            <nav className="text-sm flex flex-col items-start">
              <button className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary" onClick={() => go('/')}>
                Home
              </button>
              <button
                className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary"
                onClick={() => go('/products')}
              >
                Products
              </button>
              <button
                className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary"
                onClick={() => go('/contact')}
              >
                Contact
              </button>
            </nav>
          </section>
          <section>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Information</h3>
            <nav className="text-sm flex flex-col items-start">
              <button
                className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary"
                onClick={() => go('/about')}
              >
                About
              </button>
              <button
                className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary"
                onClick={() => go('/faq')}
              >
                FAQ
              </button>
              <button
                className="py-1.5 text-gray-600 dark:text-gray-300 hover:text-primary"
                onClick={() => go('/shipping')}
              >
                Shipping
              </button>
            </nav>
          </section>
        </div>
      </footer>
      {cartOpen && (
        <CartDrawerComponent
          cart={cart}
          total={total}
          onClose={() => setCartOpen(false)}
          onUpdate={changeQuantity}
        />
      )}
    </div>
  );
}

function Home({
  products,
  onShop,
  onViewAll,
  onContact,
  onProduct,
  onAdd,
  favorites,
  onToggleFavorite,
}: {
  products: Product[];
  onShop: () => void;
  onViewAll: () => void;
  onContact: () => void;
  onProduct: (id: number) => void;
  onAdd: (p: Product) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  return (
    <main className="min-h-screen bg-cream dark:bg-gray-900 animate-fadeIn">
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="relative z-10 bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 md:p-12 shadow-xl border border-secondary/20 dark:border-secondary/30 animate-fadeIn">
            <header className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-primary dark:text-primary-light mb-10 animate-slideUp">
                Blooming Details
              </h1>
              <p
                className="text-lg md:text-2xl text-secondary dark:text-secondary-light mb-8 max-w-3xl mx-auto animate-slideUp"
                style={{ animationDelay: '.1s' }}
              >
                With every piece we add a touch of love that blooms in your details and tells your story in its own way.
              </p>
            </header>
            <nav
              className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp"
              style={{ animationDelay: '.2s' }}
            >
              <button
                onClick={onShop}
                className="bg-primary hover:bg-primary/90 px-8 py-3 rounded-xl text-white font-medium shadow-lg inline-flex items-center justify-center hover:shadow-xl transition-all duration-300"
              >
                Explore Collection <ArrowDown className="ms-1 h-5 w-5" />
              </button>
              <button
                onClick={onContact}
                className="border border-secondary dark:border-secondary-light text-secondary dark:text-secondary-light px-8 py-3 rounded-xl font-medium shadow-sm inline-flex items-center justify-center hover:bg-secondary/10 dark:hover:bg-secondary/20 transition-all duration-300"
              >
                Contact us
              </button>
            </nav>
          </article>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      </section>
      <section id="featured-products" className="py-16 bg-cream dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary dark:text-primary-light mb-4 font-display animate-fadeIn">
              Our products
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </header>
          <ProductGridComponent
            products={products.filter((p) => p.featured).slice(0, 3)}
            onProduct={onProduct}
            onAdd={onAdd}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
          <footer className="text-center mt-12">
            <button onClick={onViewAll} className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl text-white font-medium shadow-lg inline-flex items-center justify-center hover:shadow-xl transition-all duration-300">
              View All Products
            </button>
          </footer>
        </div>
      </section>
    </main>
  );
}

function Products({
  products,
  query,
  setQuery,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  saleOnly,
  setSaleOnly,
  favoritesOnly,
  setFavoritesOnly,
  onProduct,
  onAdd,
  favorites,
  onToggleFavorite,
}: {
  products: Product[];
  query: string;
  setQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: string[];
  sort: string;
  setSort: (v: string) => void;
  saleOnly: boolean;
  setSaleOnly: (v: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (v: boolean) => void;
  onProduct: (id: number) => void;
  onAdd: (p: Product) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
}) {
  return (
    <section className="min-h-screen py-4 md:py-8 bg-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 md:mb-8 text-center animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-4 font-display">Our products</h1>
            <p className="text-secondary dark:text-secondary-light max-w-3xl mx-auto">
              Browse our collection of handcrafted, personalized products. Each item is made with care and attention to detail.
            </p>
          </div>
          <div className="catalog-controls w-full mx-auto mt-6">
          <label className="search-field">
            <Search size={17} aria-hidden="true" />
            <input
              className="w-full px-4 py-2 min-h-11 border border-primary/30 dark:border-primary-light/30 rounded-lg bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
            />
          </label>
          <select className="dark:bg-gray-700 dark:text-white dark:border-primary-light/30" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
            <option value="">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="dark:bg-gray-700 dark:text-white dark:border-primary-light/30" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="name-asc">Name: A–Z</option><option value="name-desc">Name: Z–A</option>
            <option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
          </select>
          <label className="sale-toggle dark:bg-gray-700 dark:text-white dark:border-primary-light/30"><input type="checkbox" checked={saleOnly} onChange={(e) => setSaleOnly(e.target.checked)} /> On sale</label>
          <label className="sale-toggle dark:bg-gray-700 dark:text-white dark:border-primary-light/30"><input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} /> Wishlist</label>
          </div>
        </div>
        <p className="text-sm text-secondary dark:text-secondary-light mb-4">Showing {products.length} products</p>
        <ProductGridComponent products={products} onProduct={onProduct} onAdd={onAdd} favorites={favorites} onToggleFavorite={onToggleFavorite} compactActions columns="md:grid-cols-2 lg:grid-cols-4" />
      </div>
    </section>
  );
}

function ProductPage({
  product,
  relatedProducts,
  onBack,
  onProduct,
  onAdd,
  isFavorite,
  onToggleFavorite,
}: {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onAdd: (p: Product) => void;
  onProduct: (id: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const hasDiscount = Boolean(product.previous_price && product.previous_price > product.price);
  return (
    <section className="min-h-screen py-4 md:py-8 bg-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button className="mb-4 md:mb-6 inline-flex min-h-11 items-center gap-2 text-secondary dark:text-secondary-light hover:text-primary transition-all" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </button>
        <article className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-secondary/20 dark:border-secondary/30 overflow-hidden animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <section className="p-4 md:p-6 bg-cream/50 dark:bg-gray-900/50 relative">
            {hasDiscount && <div className="absolute top-6 right-6 z-10 sale-badge sale-badge--large">Discounts</div>}
            <img className="w-full aspect-square object-cover rounded-lg shadow-md" src={product.images[activeImage] || product.images[0]} alt={product.name} />
            {product.images.length > 1 && <div className="product-thumbs">{product.images.map((image, index) => <button className={index === activeImage ? 'active' : ''} key={image} onClick={() => setActiveImage(index)}><img src={image} alt={`${product.name} view ${index + 1}`} /></button>)}</div>}
          </section>
          <section className="p-4 md:p-6 bg-gradient-to-b from-white/90 to-cream/50 dark:from-gray-800/90 dark:to-gray-900/50">
            <p className="text-sm text-secondary dark:text-secondary-light mb-2">{product.category}</p>
            <div className="flex items-start justify-between gap-4"><h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-primary-light mb-2">{product.name}</h1><button onClick={() => onToggleFavorite(product.id)} className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg ${isFavorite ? 'text-rose-500 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400 hover:text-rose-500'}`} aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}><Heart className="h-5 w-5" fill={isFavorite ? 'currentColor' : 'none'} /></button></div>
            <div className="text-2xl font-bold text-secondary dark:text-secondary-light mb-4">
              {money(product.price)}
              {hasDiscount && <div className="flex items-center gap-3 mt-2"><span className="text-lg text-gray-500 dark:text-gray-400 line-through">{money(product.previous_price!)}</span><span className="text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-medium">-{Math.round(((product.previous_price! - product.price) / product.previous_price!) * 100)}%</span></div>}
            </div>
            <p className="text-secondary dark:text-secondary-light mb-4 md:mb-6 leading-relaxed">{product.description}</p>
            <p className="text-sm text-primary dark:text-primary-light mb-4 md:mb-6">{product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? `Only ${product.stock} left in stock` : `${product.stock} available`}</p>
            <fieldset className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-primary dark:text-primary-light mb-2">Quantity</label>
              <div className="flex items-center">
                <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="product-quantity-button"><Minus size={16} /></button>
                <input type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Math.min(product.stock, Math.max(1, Number(event.target.value) || 1)))} className="product-quantity-input dark:bg-gray-900 dark:text-white" />
                <button type="button" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} className="product-quantity-button"><Plus size={16} /></button>
              </div>
            </fieldset>
            <button disabled={product.stock === 0} className="w-full px-8 py-3 rounded-xl text-white font-medium shadow-lg inline-flex items-center justify-center bg-primary hover:bg-primary/90 hover:shadow-xl transition-all duration-300 disabled:opacity-50" onClick={() => { for (let i = 0; i < quantity; i += 1) onAdd(product); }}>
              <CartPlusIcon /> <span className="ms-2">Add to Cart</span>
            </button>
          </section>
        </div>
        </article>
        {relatedProducts.length > 0 && <section className="mt-12">
          <h2 className="text-2xl font-bold text-primary dark:text-primary-light mb-6">You Might Also Like</h2>
          <ProductGridComponent products={relatedProducts} onProduct={onProduct} onAdd={onAdd} />
        </section>
        }
      </div>
    </section>
  );
}

function CartPlusIcon() {
  return <ShoppingCartPlus className="h-5 w-5" aria-hidden="true" />;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const update = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setSent(false);
    setErrors((current) => ({ ...current, [field]: '' }));
  };
  const validate = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) next.email = 'Please enter a valid email address.';
    if (!/^[+\d][\d\s().-]{6,}$/.test(values.phone.trim())) next.phone = 'Please enter a valid phone number.';
    if (!values.subject.trim()) next.subject = 'Please enter a subject.';
    if (values.message.trim().length < 10) next.message = 'Message must be at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) setSent(true);
  };
  return (
    <section className="min-h-screen py-8 bg-cream dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center animate-fadeIn"><h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-4 font-display">Contact Us</h1><p className="text-secondary dark:text-secondary-light max-w-3xl mx-auto">We'd love to hear from you. Get in touch with our team for custom orders or any questions.</p></header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <article className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-secondary/20 dark:border-secondary/30 overflow-hidden p-6 hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-6">Send Us a Message</h2>
              <form onSubmit={submit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Field label="Your Name" required value={values.name} onChange={(value) => update('name', value)} error={errors.name} /><Field label="Your Email" type="email" required value={values.email} onChange={(value) => update('email', value)} error={errors.email} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><Field label="Phone Number" required value={values.phone} onChange={(value) => update('phone', value)} error={errors.phone} /><Field label="Subject" required value={values.subject} onChange={(value) => update('subject', value)} error={errors.subject} /></div>
                <label className="block text-sm font-medium text-primary dark:text-primary-light">Your Message*<textarea value={values.message} onChange={(event) => update('message', event.target.value)} className={`mt-1 w-full min-h-11 px-4 py-2 border rounded-lg focus:ring focus:ring-primary/20 focus:border-primary outline-none bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white ${errors.message ? 'border-rose-500' : 'border-secondary/30 dark:border-secondary/30'}`} rows={5} aria-invalid={Boolean(errors.message)} />{errors.message && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-400">{errors.message}</span>}</label>
                {sent && <p className="text-sm text-primary bg-primary/10 rounded-lg p-3">Thanks. We will contact you soon.</p>}
                <button className="w-full px-6 py-3 rounded-lg text-white font-medium shadow-lg inline-flex items-center justify-center bg-primary hover:bg-primary/90 hover:shadow-xl transition-all duration-300" type="submit">Send Message</button>
              </form>
            </article>
          </section>
          <aside>
            <article className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-secondary/20 dark:border-secondary/30 overflow-hidden p-6 h-full hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold text-primary dark:text-primary-light mb-6">Contact Information</h2>
              <div className="space-y-6 text-secondary dark:text-secondary-light"><InfoLine icon={MapPin} title="Our Location" value="Algiers, Algeria" /><InfoLine icon={Mail} title="Email Us" value="hello@fanuna.example" /><InfoLine icon={Phone} title="Call Us" value="+213 555 000 000" /></div>
              <section className="mt-8"><h3 className="text-base font-medium text-primary dark:text-primary-light mb-4">Business Hours</h3><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt>Monday - Friday:</dt><dd className="text-primary dark:text-primary-light">9:00 AM - 6:00 PM</dd></div><div className="flex justify-between"><dt>Saturday:</dt><dd className="text-primary dark:text-primary-light">10:00 AM - 4:00 PM</dd></div><div className="flex justify-between"><dt>Sunday:</dt><dd className="text-primary dark:text-primary-light">Closed</dd></div></dl></section>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({ label, type = 'text', required = false, value, onChange, error }: { label: string; type?: string; required?: boolean; value: string; onChange: (value: string) => void; error?: string }) {
  return <label className="block text-sm font-medium text-primary dark:text-primary-light">{label}{required && '*'}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} className={`mt-1 w-full min-h-11 px-4 py-2 border rounded-lg focus:ring focus:ring-primary/20 focus:border-primary outline-none bg-white/90 dark:bg-gray-700/90 text-gray-800 dark:text-white ${error ? 'border-rose-500' : 'border-secondary/30 dark:border-secondary/30'}`} />{error && <span className="mt-1 block text-xs text-rose-600 dark:text-rose-400">{error}</span>}</label>;
}

function InfoLine({ icon: Icon, title, value }: { icon: typeof Package; title: string; value: string }) {
  return <div className="flex items-start gap-4"><div className="info-line-icon mt-1 size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Icon size={18} /></div><div><h3 className="text-base font-medium text-primary dark:text-primary-light">{title}</h3><p className="mt-1 text-secondary dark:text-secondary-light">{value}</p></div></div>;
}
function InfoPage({ slug }: { slug: string }) {
  const pages: Record<string, { label: string; title: string; body: string }> = {
    about: {
      label: 'OUR STORY',
      title: 'Made for a life well lived.',
      body: 'Fanuna is a small collection of useful, beautiful things. We choose pieces for their materials, their makers, and the quiet joy they bring to everyday rituals.',
    },
    faq: {
      label: 'QUESTIONS',
      title: 'The things you want to know.',
      body: 'Need help with an order or a product? Write to hello@fanuna.example and our team will be happy to help. We usually reply within one business day.',
    },
    shipping: {
      label: 'SHIPPING',
      title: 'From our door to yours.',
      body: 'Orders are carefully packed and prepared for delivery within 2–4 business days. Delivery details and availability are confirmed with you after purchase.',
    },
    returns: {
      label: 'RETURNS',
      title: 'Only the good kind of commitment.',
      body: 'If something is not right, contact us within 7 days of receiving your order. Items should be unused and in their original condition.',
    },
    privacy: {
      label: 'PRIVACY',
      title: 'Your details stay yours.',
      body: 'We only use the information you share to answer your questions and prepare your order. We do not sell your personal information.',
    },
  };
  const page = pages[slug];
  if (!page) {
    return (
      <section className="min-h-screen py-8 bg-cream dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-primary dark:text-primary-light mb-4">Page not found</h1>
          <button className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg" onClick={() => window.history.back()}>Go back</button>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen py-8 bg-cream dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center animate-fadeIn">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-light mb-4 animate-fadeIn">{page.title}</h1>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </header>
        <article className="bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-md border border-secondary/20 dark:border-secondary/30 p-6 sm:p-8 animate-fadeIn" dir="auto">
          <p className="text-base sm:text-lg leading-8 text-gray-700 dark:text-gray-200">{page.body}</p>
        </article>
        <div className="text-center mt-8">
          <button className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg transition-all duration-300" onClick={() => { window.history.pushState({}, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Back to Home
          </button>
        </div>
      </div>
    </section>
  );
}
