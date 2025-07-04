'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Package, Users, BarChart3, Settings, Store, Truck, Recycle } from "lucide-react";

const navItems = [
    { href: "/admin/dashboard", icon: <Home />, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/admin/orders", icon: <ShoppingCart />, label: "Orders", tooltip: "Orders" },
    { href: "#", icon: <Package />, label: "Products", tooltip: "Products" },
    { href: "/admin/sellers", icon: <Store />, label: "Sellers", tooltip: "Sellers" },
    { href: "/admin/customers", icon: <Users />, label: "Customers", tooltip: "Customers" },
    { href: "/admin/delivery", icon: <Truck />, label: "Delivery Partners", tooltip: "Delivery Partners" },
    { href: "/admin/waste-collection", icon: <Recycle />, label: "Waste Requests", tooltip: "Waste Requests" },
    { href: "#", icon: <BarChart3 />, label: "Analytics", tooltip: "Analytics" },
    { href: "#", icon: <Settings />, label: "Settings", tooltip: "Settings" },
];

export function AdminSidebarNav() {
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
