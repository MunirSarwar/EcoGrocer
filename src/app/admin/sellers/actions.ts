'use server';

import admin from '@/lib/firebase-admin';

export interface Seller {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
}

export async function getSellers(): Promise<Seller[]> {
  try {
    const userRecords = await admin.auth().listUsers();

    const sellers: Seller[] = userRecords.users
      .filter(user => user.displayName?.includes('(Seller)') && user.email)
      .map(user => ({
        id: user.uid,
        name: user.displayName?.replace(' (Seller)', '').trim() || 'N/A',
        email: user.email,
        emailVerified: user.emailVerified,
        joined: user.metadata.creationTime,
      }));

    return sellers;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}
