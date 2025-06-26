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
    const q = query(ordersRef, where('userId', '==', userId), orderBy('date', 'desc'));
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
    return orders;
  } catch (error: any) {
    // This error happens if the composite index for the query isn't created in Firestore yet.
    if (error.code === 'failed-precondition') {
      console.warn(
        "Firestore index missing. This is expected on the first query. " +
        "Go to the link in the Firebase console error to create it automatically."
      );
      return [];
    }
     // This error code means the collection doesn't exist yet, which is fine.
    if (error.code === 5) {
      return [];
    }
    console.error("Error fetching orders from Firestore:", error);
    return [];
  }
}

// Function to add a new order
export async function addOrder(userId: string, cartItems: CartItem[], total: number): Promise<void> {
  if (!userId || !cartItems || cartItems.length === 0) {
    throw new Error("User ID and cart items are required to place an order.");
  }
  
  try {
    const orderItems = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      image: item.image,
      description: item.description,
      quantity: item.quantity,
    }));

    const newOrderData = {
      userId,
      items: orderItems,
      total,
      date: serverTimestamp(),
    };

    await addDoc(collection(db, 'orders'), newOrderData);

  } catch (error) {
    console.error("Failed to write order to Firestore:", error);
    // Re-throw a more user-friendly error to be caught by the checkout page.
    throw new Error("Could not save your order. Please try again.");
  }
}
