'use client';

import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import type { CartItem } from './cart-service';

export interface Order {
  id: string;
  date: string; // Storing as ISO string
  items: CartItem[];
  total: number;
  userId: string;
}

// Function to fetch orders for a specific user
export async function getOrders(userId: string): Promise<Order[]> {
  if (!userId) {
    return [];
  }
  try {
    const ordersRef = collection(db, 'orders');
    // We removed orderBy('date') to avoid needing a composite index.
    // We will sort the results in JavaScript instead.
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure date is a Firestore Timestamp before converting
      const date = data.date instanceof Timestamp ? data.date.toDate().toISOString() : new Date().toISOString();
      orders.push({
        id: doc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        date: date,
      });
    });

    // Sort orders by date descending in JavaScript
    orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return orders;
  } catch (error: any) {
    // This error code means the collection doesn't exist yet, which is fine for new users.
    if (error.code === 5) { // Firestore code for NOT_FOUND
      return [];
    }
    console.error("Error fetching orders from Firestore:", error);
    // For any other errors, return an empty array to prevent crashing the page.
    return [];
  }
}

// Function to add a new order
export async function addOrder(userId: string, cartItems: CartItem[], total: number): Promise<void> {
  if (!userId || !cartItems || cartItems.length === 0) {
    throw new Error("User ID and cart items are required to place an order.");
  }
  
  try {
    // We create a clean object to avoid any issues with complex object structures
    // that might not be directly compatible with Firestore.
    const newOrderData = {
      userId: userId,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image,
        description: item.description,
        quantity: item.quantity,
      })),
      total: total,
      date: serverTimestamp(),
    };

    await addDoc(collection(db, 'orders'), newOrderData);

  } catch (error) {
    console.error("Failed to write order to Firestore:", error);
    // Re-throw a more user-friendly error to be caught by the checkout page.
    throw new Error("Could not save your order to the database. Please try again.");
  }
}
