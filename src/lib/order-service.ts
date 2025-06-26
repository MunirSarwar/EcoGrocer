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
  } catch (error) {
    console.error("Error fetching orders from Firestore:", error);
    return [];
  }
}

// Function to add a new order
export async function addOrder(userId: string, cartItems: CartItem[], total: number): Promise<Order | null> {
  if (!userId || !cartItems || cartItems.length === 0) {
    return null;
  }
  try {
    const newOrderData = {
      userId,
      items: cartItems,
      total,
      date: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'orders'), newOrderData);
    
    return {
        id: docRef.id,
        items: cartItems,
        total,
        userId,
        date: new Date().toISOString() // Return current date as a temporary placeholder
    };

  } catch (error) {
    console.error("Error adding order to Firestore:", error);
    return null;
  }
}
