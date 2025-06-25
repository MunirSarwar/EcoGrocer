import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGrid from "@/components/product-grid";
import { Leaf, Carrot, Milk, Wheat } from "lucide-react";

const categories = [
  { name: "Fresh Vegetables", icon: <Carrot className="w-12 h-12 text-primary" /> },
  { name: "Organic Fruits", icon: <Leaf className="w-12 h-12 text-primary" /> },
  { name: "Dairy & Alternatives", icon: <Milk className="w-12 h-12 text-primary" /> },
  { name: "Bakery & Grains", icon: <Wheat className="w-12 h-12 text-primary" /> },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="bg-secondary/50 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
              Fresh, Sustainable, Delivered.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the best of nature's bounty with EcoGrocer Hub. We bring you fresh, organic, and eco-friendly products right to your doorstep.
            </p>
            <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
              Start Shopping
            </Button>
          </div>
        </section>

        <section id="categories" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {categories.map((category) => (
                <Card key={category.name} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      {category.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-headline text-xl">{category.name}</CardTitle>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="py-16 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Featured Products</h2>
            <ProductGrid />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
