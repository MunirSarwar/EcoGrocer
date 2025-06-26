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

// Add some initial products so the store doesn't look empty.
export const initialProducts: Product[] = [
    {
        id: 1,
        name: 'Organic Carrots',
        category: 'Vegetables',
        price: 50,
        image: 'https://placehold.co/400x400.png',
        description: 'Fresh, crunchy organic carrots, packed with vitamins.',
    },
    {
        id: 2,
        name: 'Fresh Apples',
        category: 'Fruits',
        price: 120,
        image: 'https://placehold.co/400x400.png',
        description: 'Crisp and juicy apples, perfect for a healthy snack.',
    },
    {
        id: 3,
        name: 'Almond Milk',
        category: 'Dairy',
        price: 200,
        image: 'https://placehold.co/400x400.png',
        description: 'A creamy and delicious dairy-free alternative.',
    },
    {
        id: 4,
        name: 'Sourdough Bread',
        category: 'Bakery',
        price: 150,
        image: 'https://placehold.co/400x400.png',
        description: 'Artisanal sourdough loaf with a tangy flavor and crisp crust.',
    }
];

const PRODUCTS_STORAGE_KEY = 'eco-grocer-products';

export function getProducts(): Product[] {
  if (!isBrowser) {
    return initialProducts; // Return initial products during server-side render
  }
  try {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      // Ensure we always return an array, even if localStorage is corrupted.
      const parsed = JSON.parse(storedProducts);
      return Array.isArray(parsed) ? parsed : [];
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

export function updateProduct(updatedProduct: Product): Product {
    if (!isBrowser) {
        throw new Error("updateProduct cannot be called on the server.");
    }
    const currentProducts = getProducts();
    const productIndex = currentProducts.findIndex(p => p.id === updatedProduct.id);

    if (productIndex === -1) {
        throw new Error("Product not found");
    }

    const updatedProducts = [...currentProducts];
    updatedProducts[productIndex] = updatedProduct;
    
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    return updatedProduct;
}

export function deleteProduct(productId: number): void {
    if (!isBrowser) {
        throw new Error("deleteProduct cannot be called on the server.");
    }
    const currentProducts = getProducts();
    const updatedProducts = currentProducts.filter(p => p.id !== productId);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
}
