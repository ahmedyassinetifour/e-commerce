import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CartLine, Product } from '../types';

const loadCart = (): CartLine[] => {
  try {
    return JSON.parse(localStorage.getItem('fanuna.cart') || '[]') as CartLine[];
  } catch {
    return [];
  }
};

const loadFavorites = (): number[] => {
  try { return JSON.parse(localStorage.getItem('fanuna.favorites') || '[]') as number[]; } catch { return []; }
};

type CartState = { items: CartLine[]; favorites: number[] };

const initialState: CartState = { items: loadCart(), favorites: loadFavorites() };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existing = state.items.find((line) => line.product.id === product.id);
      if (!existing) {
        if (product.stock > 0) state.items.push({ product, quantity: 1 });
        return;
      }
      if (existing.quantity < product.stock) existing.quantity += 1;
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; amount: number }>) => {
      const line = state.items.find((item) => item.product.id === action.payload.id);
      if (!line) return;
      line.quantity = Math.min(line.product.stock, Math.max(0, line.quantity + action.payload.amount));
      state.items = state.items.filter((item) => item.quantity > 0);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload);
    },
    clearCart: (state) => { state.items = []; },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, toggleFavorite } = cartSlice.actions;
export default cartSlice.reducer;
