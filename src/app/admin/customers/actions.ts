'use server';

import admin from '@/lib/firebase-admin';

export interface Customer {
    id: string;
    name: string | undefined;
    email: string | undefined;
    emailVerified: boolean;
    joined: string;
}

export async function getCustomers(): Promise<Customer[]> {
  try {
    const userRecords = await admin.auth().listUsers();

    const customers: Customer[] = userRecords.users
      .filter(user => user.email)
      .map(user => ({
        id: user.uid,
        name: user.displayName || 'N/A',
        email: user.email,
        emailVerified: user.emailVerified,
        joined: user.metadata.creationTime,
      }));

    return customers;
  } catch (error) {
    console.error('Error fetching users:', error);
    // In a real app, you'd want more robust error handling.
    // For now, we return an empty array on failure.
    return [];
  }
}
