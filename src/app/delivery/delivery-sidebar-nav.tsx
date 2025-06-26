
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutGrid, Truck } from "lucide-react";

const navItems = [
    { href: "/delivery/dashboard", icon: <LayoutGrid />, label: "Dashboard", tooltip: "Dashboard" },
    { href: "#", icon: <Truck />, label: "Assigned Deliveries", tooltip: "Deliveries" },
];

export function DeliverySidebarNav() {
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
