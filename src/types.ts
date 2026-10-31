export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  previous_price?: number;
  stock: number;
  featured: boolean;
  category: string;
  images: string[];
};

export type CartLine = { product: Product; quantity: number };
export type View = 'home' | 'products' | 'product' | 'contact' | 'page';
