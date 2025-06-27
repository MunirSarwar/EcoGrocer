'use server';

import admin from '@/lib/firebase-admin';
import type { Timestamp } from 'firebase-admin/firestore';

export interface WasteRequest {
    id: string;
    userId: string;
    customerName: string | undefined;
    customerEmail: string | undefined;
    wasteType: string;
    weight: number;
    address: string;
    phone: string;
    pickupDate: string;
    status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
    createdAt: string;
}

export async function getWasteRequests(): Promise<WasteRequest[]> {
  try {
    const firestore = admin.firestore();
    const requestsSnapshot = await firestore.collection('wasteCollectionRequests').orderBy('createdAt', 'desc').get();

    if (requestsSnapshot.empty) {
        return [];
    }

    const requests: WasteRequest[] = await Promise.all(
        requestsSnapshot.docs.map(async (doc) => {
            const requestData = doc.data();
            let customerName: string | undefined = 'N/A';
            let customerEmail: string | undefined = 'N/A';

            try {
                const userRecord = await admin.auth().getUser(requestData.userId);
                customerName = userRecord.displayName?.replace(' (Seller)', '').replace(' (Delivery)', '').trim();
                customerEmail = userRecord.email;
            } catch (userError) {
                console.warn(`Could not fetch user data for userId: ${requestData.userId}`, userError);
            }
            
            const createdAt = (requestData.createdAt as Timestamp).toDate().toISOString();
            const pickupDate = (requestData.pickupDate as Timestamp).toDate().toISOString();

            return {
                id: doc.id,
                userId: requestData.userId,
                customerName,
                customerEmail,
                wasteType: requestData.wasteType,
                weight: requestData.weight,
                address: requestData.address,
                phone: requestData.phone,
                pickupDate: pickupDate,
                status: requestData.status || 'pending',
                createdAt: createdAt,
            };
        })
    );

    return requests;
  } catch (error: any) {
    if (error.code === 5) { // NOT_FOUND if collection doesn't exist
      return [];
    }
    console.error('Error fetching waste requests:', error);
    return [];
  }
}
