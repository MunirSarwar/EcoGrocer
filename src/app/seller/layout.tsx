import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarHeader, SidebarContent } from "@/components/ui/sidebar";
import Logo from "@/components/logo";
import { SellerSidebarNav } from "./seller-sidebar-nav";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import Link from 'next/link';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                 <Logo />
            </SidebarHeader>
            <SidebarContent>
                <SellerSidebarNav />
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 h-16">
            <SidebarTrigger className="md:hidden" />
            <div className="hidden md:block">
                <h1 className="text-xl font-semibold">Seller Hub</h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                 <Button variant="outline" size="icon" className="rounded-full" asChild>
                    <Link href="/profile">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User Menu</span>
                    </Link>
                </Button>
            </div>
          </header>
          <main className="p-4 lg:p-6 bg-secondary/30 flex-1">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
