'use client';

import type { CartItem } from './cart-service';

const isBrowser = typeof window !== 'undefined';
const ORDERS_STORAGE_KEY = 'eco-grocer-orders';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  userId: string;
}

function getOrdersStorageKey(userId: string): string {
    return `${ORDERS_STORAGE_KEY}-${userId}`;
}

export function getOrders(userId: string): Order[] {
  if (!isBrowser || !userId) {
    return [];
  }
  try {
    const storedOrders = localStorage.getItem(getOrdersStorageKey(userId));
    if (storedOrders) {
      const parsed = JSON.parse(storedOrders);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Failed to access localStorage for orders:", error);
    return [];
  }
}

function saveOrders(userId: string, orders: Order[]): void {
  if (isBrowser && userId) {
    localStorage.setItem(getOrdersStorageKey(userId), JSON.stringify(orders));
  }
}

export function addOrder(userId: string, cartItems: CartItem[], total: number): Order[] {
  if (!isBrowser) {
    throw new Error("addOrder cannot be called on the server.");
  }
  const currentOrders = getOrders(userId);
  const newOrder: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    date: new Date().toISOString(),
    items: cartItems,
    total: total,
    userId: userId,
  };
  
  const updatedOrders = [newOrder, ...currentOrders];
  saveOrders(userId, updatedOrders);
  return updatedOrders;
}
