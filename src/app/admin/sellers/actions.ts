
'use server';

import admin from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';

export interface Seller {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
    pan?: string;
    gst?: string;
    status?: 'pending' | 'approved' | 'rejected' | string;
}

export async function getSellers(): Promise<Seller[]> {
  try {
    const firestore = admin.firestore();
    const userRecords = await admin.auth().listUsers();

    const sellerUsers = userRecords.users
      .filter(user => user.displayName?.includes('(Seller)') && user.email);

    const sellers: Seller[] = await Promise.all(
        sellerUsers.map(async (user) => {
            let pan: string | undefined = 'N/A';
            let gst: string | undefined = 'N/A';
            let status: Seller['status'] = 'pending';

            try {
                const sellerDoc = await firestore.collection('sellers').doc(user.uid).get();
                if (sellerDoc.exists) {
                    const data = sellerDoc.data();
                    pan = data?.pan;
                    gst = data?.gst || 'N/A';
                    status = data?.status;
                }
            } catch (e) {
                console.error(`Failed to fetch firestore data for seller ${user.uid}`, e);
            }
            
            return {
                id: user.uid,
                name: user.displayName?.replace(' (Seller)', '').trim() || 'N/A',
                email: user.email,
                emailVerified: user.emailVerified,
                joined: user.metadata.creationTime,
                pan,
                gst,
                status,
            };
        })
    );

    return sellers;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}


export async function approveSeller(sellerId: string): Promise<{ success: boolean; message: string }> {
  try {
    const firestore = admin.firestore();
    await firestore.collection('sellers').doc(sellerId).set({ status: 'approved' }, { merge: true });
    
    const user = await admin.auth().getUser(sellerId);
    console.log(`SIMULATION: Approval email sent to seller ${user.email}`);

    revalidatePath('/admin/sellers');
    return { success: true, message: 'Seller approved successfully.' };
  } catch (error) {
    console.error('Error approving seller:', error);
    return { success: false, message: 'Failed to approve seller.' };
  }
}

export async function rejectSeller(sellerId: string): Promise<{ success: boolean; message: string }> {
  try {
    const firestore = admin.firestore();
    await firestore.collection('sellers').doc(sellerId).set({ status: 'rejected' }, { merge: true });

    const user = await admin.auth().getUser(sellerId);
    console.log(`SIMULATION: Rejection email sent to seller ${user.email}`);
    
    revalidatePath('/admin/sellers');
    return { success: true, message: 'Seller rejected successfully.' };
  } catch (error) {
    console.error('Error rejecting seller:', error);
    return { success: false, message: 'Failed to reject seller.' };
  }
}
