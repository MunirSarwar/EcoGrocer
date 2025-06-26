
'use server';

import admin from '@/lib/firebase-admin';

export interface DeliveryPartner {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
}

export async function getDeliveryPartners(): Promise<DeliveryPartner[]> {
  try {
    const userRecords = await admin.auth().listUsers();

    const deliveryPartners: DeliveryPartner[] = userRecords.users
      .filter(user => user.displayName?.includes('(Delivery)') && user.email)
      .map(user => ({
        id: user.uid,
        name: user.displayName?.replace(' (Delivery)', '').trim() || 'N/A',
        email: user.email,
        emailVerified: user.emailVerified,
        joined: user.metadata.creationTime,
      }));

    return deliveryPartners;
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return [];
  }
}
