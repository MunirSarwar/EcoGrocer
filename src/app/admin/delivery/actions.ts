
'use server';

import admin from '@/lib/firebase-admin';

export interface DeliveryPartner {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
    vehicleType?: string;
}

export async function getDeliveryPartners(): Promise<DeliveryPartner[]> {
  try {
    const firestore = admin.firestore();
    const userRecords = await admin.auth().listUsers();

    const deliveryUsers = userRecords.users
      .filter(user => user.displayName?.includes('(Delivery)') && user.email);

    const deliveryPartners: DeliveryPartner[] = await Promise.all(
      deliveryUsers.map(async (user) => {
        let vehicleType: string | undefined = 'N/A';
        try {
          const partnerDoc = await firestore.collection('deliveryPartners').doc(user.uid).get();
          if (partnerDoc.exists) {
            vehicleType = partnerDoc.data()?.vehicleType;
          }
        } catch (e) {
          console.error(`Failed to fetch firestore data for partner ${user.uid}`, e);
        }

        return {
          id: user.uid,
          name: user.displayName?.replace(' (Delivery)', '').trim() || 'N/A',
          email: user.email,
          emailVerified: user.emailVerified,
          joined: user.metadata.creationTime,
          vehicleType: vehicleType,
        };
      })
    );
    
    return deliveryPartners;
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return [];
  }
}
