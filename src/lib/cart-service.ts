'use client';

import type { Product } from './product-service';

const isBrowser = typeof window !== 'undefined';
const CART_STORAGE_KEY = 'eco-grocer-cart';

export interface CartItem extends Product {
  quantity: number;
}

export function getCartItems(): CartItem[] {
  if (!isBrowser) {
    return [];
  }
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Failed to access localStorage for cart:", error);
    return [];
  }
}

function saveCartItems(cartItems: CartItem[]): void {
  if (isBrowser) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }
}

export function addToCart(product: Product): CartItem[] {
  if (!isBrowser) {
    throw new Error("addToCart cannot be called on the server.");
  }
  const currentItems = getCartItems();
  const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

  if (existingItemIndex > -1) {
    const existingItem = currentItems[existingItemIndex];
    if (existingItem.quantity < 8) {
      existingItem.quantity += 1;
    }
  } else {
    currentItems.push({ ...product, quantity: 1 });
  }

  saveCartItems(currentItems);
  return currentItems;
}

export function updateItemQuantity(productId: number, quantity: number): CartItem[] {
    if (!isBrowser) {
        throw new Error("updateItemQuantity cannot be called on the server.");
    }
    const currentItems = getCartItems();
    const itemIndex = currentItems.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        if (quantity > 0 && quantity <= 8) {
            currentItems[itemIndex].quantity = quantity;
        } else if (quantity <= 0) {
            currentItems.splice(itemIndex, 1);
        }
    }
    saveCartItems(currentItems);
    return currentItems;
}


export function removeFromCart(productId: number): CartItem[] {
  if (!isBrowser) {
    throw new Error("removeFromCart cannot be called on the server.");
  }
  let currentItems = getCartItems();
  currentItems = currentItems.filter(item => item.id !== productId);
  saveCartItems(currentItems);
  return currentItems;
}

export function clearCart(): void {
  if (isBrowser) {
    localStorage.removeItem(CART_STORAGE_KEY);
  }
}
