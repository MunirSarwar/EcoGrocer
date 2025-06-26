'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as CartService from '@/lib/cart-service';
import type { Product } from '@/lib/product-service';

interface CartContextType {
  cartItems: CartService.CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateItemQuantity: (productId: number, quantity: number) => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartService.CartItem[]>([]);

  useEffect(() => {
    // Initialize cart from localStorage on mount
    setCartItems(CartService.getCartItems());
  }, []);
  
  const addToCart = useCallback((product: Product) => {
    const newCartItems = CartService.addToCart(product);
    setCartItems(newCartItems);
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    const newCartItems = CartService.removeFromCart(productId);
    setCartItems(newCartItems);
  }, []);

  const updateItemQuantity = useCallback((productId: number, quantity: number) => {
    const newCartItems = CartService.updateItemQuantity(productId, quantity);
    setCartItems(newCartItems);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateItemQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
