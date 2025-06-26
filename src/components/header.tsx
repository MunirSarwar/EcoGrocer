'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';

import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, User, LogOut, Package, LayoutGrid, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/hooks/use-cart';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Cart from '@/components/cart';

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map((n) => n[0]).join('');
  return initials.substring(0, 2).toUpperCase();
};

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { cartCount } = useCart();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth(app);
    await signOut(auth);
    toast({
        title: "Logout Successful",
        description: "You have been successfully logged out.",
    });
    router.push('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/#categories" className="hover:text-primary transition-colors">
            Categories
          </Link>
          <Link href="/#products" className="hover:text-primary transition-colors">
            Products
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Deals
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            About Us
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-10 w-40 rounded-md" />
          ) : user ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs">
                        {cartCount}
                      </span>
                    )}
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Open Cart</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col p-0">
                  <Cart />
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{getInitials(user.displayName) || <User />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.displayName?.includes('(Seller)') ? (
                      <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href="/seller/dashboard">
                              <LayoutGrid className="mr-2 h-4 w-4" />
                              <span>Seller Dashboard</span>
                          </Link>
                      </DropdownMenuItem>
                  ) : (
                      <>
                          <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="/profile">
                                  <User className="mr-2 h-4 w-4" />
                                  <span>My Profile</span>
                              </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer">
                              <Link href="#">
                                  <Package className="mr-2 h-4 w-4" />
                                  <span>My Orders</span>
                              </Link>
                          </DropdownMenuItem>
                      </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2" />
                  Login
                  <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/login/customer">Customer</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/seller">Seller</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login/admin">Admin</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
