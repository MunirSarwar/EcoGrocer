
'use server';

import admin from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export interface DeliveryPartner {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
    vehicleType?: string;
    phone?: string;
    licenseNumber?: string;
    status?: 'pending' | 'approved' | 'rejected' | string;
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
        let phone: string | undefined = 'N/A';
        let licenseNumber: string | undefined = 'N/A';
        let status: DeliveryPartner['status'] = 'pending';

        try {
          const partnerDoc = await firestore.collection('deliveryPartners').doc(user.uid).get();
          if (partnerDoc.exists) {
            const data = partnerDoc.data();
            vehicleType = data?.vehicleType;
            phone = data?.phone;
            licenseNumber = data?.licenseNumber;
            status = data?.status;
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
          phone: phone,
          licenseNumber: licenseNumber,
          status: status,
        };
      })
    );
    
    return deliveryPartners;
  } catch (error) {
    console.error('Error fetching delivery partners:', error);
    return [];
  }
}

export async function approvePartner(partnerId: string): Promise<{ success: boolean; message: string }> {
  try {
    const firestore = admin.firestore();
    await firestore.collection('deliveryPartners').doc(partnerId).update({ status: 'approved' });
    
    // In a real app, you would trigger an email here using a service like SendGrid or Resend.
    // For this prototype, we log a confirmation to the console.
    const user = await admin.auth().getUser(partnerId);
    console.log(`SIMULATION: Approval email sent to ${user.email}`);

    revalidatePath('/admin/delivery');
    return { success: true, message: 'Partner approved successfully.' };
  } catch (error) {
    console.error('Error approving partner:', error);
    return { success: false, message: 'Failed to approve partner.' };
  }
}

export async function rejectPartner(partnerId: string): Promise<{ success: boolean; message: string }> {
  try {
    const firestore = admin.firestore();
    await firestore.collection('deliveryPartners').doc(partnerId).update({ status: 'rejected' });

    // In a real app, you would trigger an email here.
    const user = await admin.auth().getUser(partnerId);
    console.log(`SIMULATION: Rejection email sent to ${user.email}`);
    
    revalidatePath('/admin/delivery');
    return { success: true, message: 'Partner rejected successfully.' };
  } catch (error) {
    console.error('Error rejecting partner:', error);
    return { success: false, message: 'Failed to reject partner.' };
  }
}
