'use client';

import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './product-card';

export interface Product {
  id: number;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Bakery';
  price: number;
  image: string;
  description: string;
}

const allProducts: Product[] = [
  { id: 1, name: 'Organic Carrots', category: 'Vegetables', price: 80, image: 'https://placehold.co/400x400/F4A261/FFFFFF.png', description: '500g of fresh, crunchy organic carrots.' },
  { id: 2, name: 'Heirloom Tomatoes', category: 'Vegetables', price: 120, image: 'https://placehold.co/400x400/E76F51/FFFFFF.png', description: '500g of colorful and sweet heirloom tomatoes.' },
  { id: 3, name: 'Gala Apples', category: 'Fruits', price: 250, image: 'https://placehold.co/400x400/D62828/FFFFFF.png', description: '1kg of crisp and sweet apples, perfect for snacking.' },
  { id: 4, name: 'Organic Bananas', category: 'Fruits', price: 90, image: 'https://placehold.co/400x400/FCBF49/000000.png', description: 'A dozen ripe, organic bananas.' },
  { id: 5, name: 'Almond Milk', category: 'Dairy', price: 280, image: 'https://placehold.co/400x400/CAF0F8/000000.png', description: '1L of unsweetened vanilla almond milk.' },
  { id: 6, name: 'Free-Range Eggs', category: 'Dairy', price: 150, image: 'https://placehold.co/400x400/F1FAEE/000000.png', description: 'A dozen large brown free-range eggs.' },
  { id: 7, name: 'Sourdough Bread', category: 'Bakery', price: 220, image: 'https://placehold.co/400x400/BC6C25/FFFFFF.png', description: 'Artisanal sourdough loaf, baked fresh daily.' },
  { id: 8, name: 'Whole Wheat Loaf', category: 'Bakery', price: 70, image: 'https://placehold.co/400x400/8A5A44/FFFFFF.png', description: 'Hearty and healthy whole wheat bread.' },
];

export default function ProductGrid() {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('default');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    if (filter !== 'All') {
      products = products.filter((p) => p.category === filter);
    }

    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }

    return products;
  }, [filter, sort]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Select onValueChange={setFilter} defaultValue="All">
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Vegetables">Vegetables</SelectItem>
              <SelectItem value="Fruits">Fruits</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
              <SelectItem value="Bakery">Bakery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select onValueChange={setSort} defaultValue="default">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredAndSortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
