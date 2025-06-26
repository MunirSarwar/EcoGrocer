'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutGrid, Package } from "lucide-react";

const navItems = [
    { href: "/seller/dashboard", icon: <LayoutGrid />, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/seller/products", icon: <Package />, label: "Products", tooltip: "Products" },
];

export function SellerSidebarNav() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.tooltip}
                    >
                        <Link href={item.href}>
                            {item.icon}
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
