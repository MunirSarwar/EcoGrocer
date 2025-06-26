'use client';

// We can't use localStorage on the server, so we need to be careful.
const isBrowser = typeof window !== 'undefined';

export interface Product {
  id: number;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Dairy' | 'Bakery';
  price: number;
  image: string;
  description: string;
}

export const initialProducts: Product[] = [
  { id: 1, name: 'Organic Carrots', category: 'Vegetables', price: 80, image: 'https://placehold.co/400x400.png', description: '500g of fresh, crunchy organic carrots.' },
  { id: 2, name: 'Heirloom Tomatoes', category: 'Vegetables', price: 120, image: 'https://placehold.co/400x400.png', description: '500g of colorful and sweet heirloom tomatoes.' },
  { id: 3, name: 'Gala Apples', category: 'Fruits', price: 250, image: 'https://placehold.co/400x400.png', description: '1kg of crisp and sweet apples, perfect for snacking.' },
  { id: 4, name: 'Organic Bananas', category: 'Fruits', price: 90, image: 'https://placehold.co/400x400.png', description: 'A dozen ripe, organic bananas.' },
  { id: 5, name: 'Almond Milk', category: 'Dairy', price: 280, image: 'https://placehold.co/400x400.png', description: '1L of unsweetened vanilla almond milk.' },
  { id: 6, name: 'Free-Range Eggs', category: 'Dairy', price: 150, image: 'https://placehold.co/400x400.png', description: 'A dozen large brown free-range eggs.' },
  { id: 7, name: 'Sourdough Bread', category: 'Bakery', price: 220, image: 'https://placehold.co/400x400.png', description: 'Artisanal sourdough loaf, baked fresh daily.' },
  { id: 8, name: 'Whole Wheat Loaf', category: 'Bakery', price: 70, image: 'https://placehold.co/400x400.png', description: 'Hearty and healthy whole wheat bread.' },
];

const PRODUCTS_STORAGE_KEY = 'eco-grocer-products';

export function getProducts(): Product[] {
  if (!isBrowser) {
    return initialProducts; // Return initial products during server-side render
  }
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      return JSON.parse(storedProducts);
    } else {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
  } catch (error) {
    console.error("Failed to access localStorage:", error);
    return initialProducts;
  }
}

export function addProduct(newProductData: Omit<Product, 'id' | 'image'> & { imageUrl: string }): Product {
    if (!isBrowser) {
        throw new Error("addProduct cannot be called on the server.");
    }
    const currentProducts = getProducts();
    const newProduct: Product = {
        name: newProductData.name,
        category: newProductData.category,
        price: newProductData.price,
        description: newProductData.description,
        image: newProductData.imageUrl,
        id: Date.now(), // Simple unique ID for prototype
    };
    const updatedProducts = [...currentProducts, newProduct];
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    return newProduct;
}
