'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, ShieldCheck, Phone, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const getInitials = (name: string | null | undefined): string => {
  if (!name) return 'U';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.substring(0, 2).toUpperCase();
};

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-64 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 text-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login/customer">Login Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center text-center">
          <Avatar className="h-24 w-24 text-3xl mb-4">
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-3xl">{user.displayName}</CardTitle>
          <CardDescription>
            {user.emailVerified ? (
              <Badge variant="default" className="mt-2">Verified Account</Badge>
            ) : (
              <Badge variant="secondary" className="mt-2">Pending Verification</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-md">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-md">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
                <p className="font-medium">Phone Number</p>
                <p className="text-muted-foreground italic">Not set - requires database setup</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-md">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground italic">Not set - requires database setup</p>
              </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-md">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">User ID</p>
              <p className="text-muted-foreground break-all">{user.uid}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
