'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateItemQuantity, cartCount, cartTotal } = useCart();

  return (
    <>
      <SheetHeader className="px-6">
        <SheetTitle>My Cart ({cartCount})</SheetTitle>
        <SheetDescription>
            Items in your shopping cart.
        </SheetDescription>
      </SheetHeader>
      <Separator />
      {cartItems.length > 0 ? (
        <>
        <ScrollArea className="flex-grow px-6">
            <div className="flex flex-col gap-4 py-4">
                {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                    <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint={item.name.toLowerCase().split(' ').slice(0, 2).join(' ')}
                    />
                    <div className="flex-grow">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= 8}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                ))}
            </div>
        </ScrollArea>
        <Separator />
        <SheetFooter className="px-6 py-4 bg-secondary/50">
            <div className="w-full space-y-4">
                <div className="flex justify-between text-base font-medium">
                    <p>Subtotal</p>
                    <p>₹{cartTotal.toFixed(2)}</p>
                </div>
                <Button className="w-full" disabled>Proceed to Checkout</Button>
            </div>
        </SheetFooter>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started.</p>
        </div>
      )}
    </>
  );
}
