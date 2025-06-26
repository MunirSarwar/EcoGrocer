import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { PackagePlus, User } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
        <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10 h-16">
            <Logo />
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="outline">
                    <PackagePlus className="mr-2 h-4 w-4" />
                    View My Products
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User Menu</span>
                </Button>
            </div>
        </header>
        <main className="p-4 lg:p-6 flex-1">{children}</main>
    </div>
  );
}
