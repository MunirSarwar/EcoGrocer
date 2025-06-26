'use client';

import { useState, useMemo, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from './product-card';
import { getProducts, type Product } from '@/lib/product-service';

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('default');

  useEffect(() => {
    // Fetch products on client side to use localStorage
    setProducts(getProducts());
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let productsToProcess = [...products];

    if (filter !== 'All') {
      productsToProcess = productsToProcess.filter((p) => p.category === filter);
    }

    if (sort === 'price-asc') {
      productsToProcess.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      productsToProcess.sort((a, b) => b.price - a.price);
    }

    return productsToProcess;
  }, [products, filter, sort]);

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
