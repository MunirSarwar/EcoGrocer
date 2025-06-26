'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';

import { app } from '@/lib/firebase';
import { getOrders, type Order } from '@/lib/order-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function OrdersPage() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                setOrders(getOrders(currentUser.uid));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
             <div className="container mx-auto px-4 py-8 md:py-12">
                <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">My Orders</h1>
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
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
                    <CardDescription>You must be logged in to view your orders.</CardDescription>
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
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">My Orders</h1>
            {orders.length > 0 ? (
                 <Accordion type="single" collapsible className="w-full space-y-4">
                    {orders.map((order) => (
                        <AccordionItem value={order.id} key={order.id} className="bg-card border rounded-lg px-6">
                            <AccordionTrigger>
                                <div className="flex justify-between w-full pr-4 text-left">
                                    <div>
                                        <p className="font-medium">Order ID: {order.id.substring(6, 15)}...</p>
                                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">₹{order.total.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">{order.items.length} item(s)</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Separator className="my-4"/>
                                <div className="space-y-4">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="rounded-md object-cover"
                                                data-ai-hint={item.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                                            />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Orders Yet</CardTitle>
                        <CardDescription>You haven't placed any orders. Start shopping to see your orders here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                        <Link href="/">Continue Shopping</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
