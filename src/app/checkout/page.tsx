'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { addOrder } from '@/lib/order-service';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleConfirmOrder = () => {
    if (!user) {
        toast({
            title: "Please Login",
            description: "You must be logged in to place an order.",
            variant: "destructive",
        });
        router.push('/login/customer');
        return;
    }
    
    setLoading(true);

    // In a real app, this would trigger payment processing.
    // For this prototype, we'll save the order, clear the cart, and redirect.
    addOrder(user.uid, cartItems, cartTotal);
    
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. We've saved your order.",
    });
    
    clearCart();
    router.push('/orders');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12 flex justify-center">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>You have no items in your cart to check out.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
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
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
               <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertTitle>Payment Gateway</AlertTitle>
                    <AlertDescription>
                        This is a prototype. No real payment will be processed.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleConfirmOrder} disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</> : 'Confirm Order'}
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
