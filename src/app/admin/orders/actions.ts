'use server';

import admin from '@/lib/firebase-admin';
import type { CartItem } from '@/lib/cart-service';

export interface AdminOrder {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    userId: string;
    customerName: string | undefined;
    customerEmail: string | undefined;
}

export async function getAllOrders(): Promise<AdminOrder[]> {
  try {
    const firestore = admin.firestore();
    const ordersSnapshot = await firestore.collection('orders').orderBy('date', 'desc').get();

    if (ordersSnapshot.empty) {
        return [];
    }

    const orders: AdminOrder[] = await Promise.all(
        ordersSnapshot.docs.map(async (doc) => {
            const orderData = doc.data();
            let customerName: string | undefined = 'N/A';
            let customerEmail: string | undefined = 'N/A';

            try {
                const userRecord = await admin.auth().getUser(orderData.userId);
                customerName = userRecord.displayName?.replace(' (Seller)', '').trim();
                customerEmail = userRecord.email;
            } catch (userError) {
                console.warn(`Could not fetch user data for userId: ${orderData.userId}`, userError);
            }
            
            return {
                id: doc.id,
                userId: orderData.userId,
                items: orderData.items,
                total: orderData.total,
                date: orderData.date.toDate().toISOString(),
                customerName,
                customerEmail,
            };
        })
    );

    return orders;
  } catch (error: any) {
    // This error code (5) means "NOT_FOUND". It's thrown if the 'orders' collection
    // doesn't exist yet (i.e., no orders have been placed). 
    // This is an expected condition, not an actual error, so we can safely return an empty array.
    if (error.code === 5) {
      return [];
    }
    // For any other unexpected errors, we log them and return an empty array 
    // to prevent the page from crashing.
    console.error('Error fetching all orders:', error);
    return [];
  }
}
