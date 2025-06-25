import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
  return (
    <footer className="bg-secondary/70">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-muted-foreground text-sm">Your one-stop shop for fresh and sustainable groceries.</p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/#products" className="hover:text-primary">Products</Link></li>
              <li><Link href="#" className="hover:text-primary">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-headline text-lg font-semibold">Follow Us</h3>
            <p className="mt-4 text-sm text-muted-foreground">Stay updated with our latest products and offers.</p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EcoGrocer Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
