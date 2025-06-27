'use client';

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface WasteRequestData {
    wasteType: string;
    weight: number;
    address: string;
    phone: string;
    pickupDate: Date;
}

export async function addWasteRequest(userId: string, data: WasteRequestData): Promise<void> {
  if (!userId) {
    throw new Error("User ID is required to submit a waste collection request.");
  }
  
  try {
    const newRequest = {
      userId: userId,
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'wasteCollectionRequests'), newRequest);

  } catch (error) {
    console.error("Failed to write waste request to Firestore:", error);
    throw new Error("Could not save your request to the database. Please try again.");
  }
}
