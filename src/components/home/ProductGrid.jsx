import React from 'react';
import ProductCard from './ProductCard';
import { Loader2, Leaf } from 'lucide-react';

export default function ProductGrid({ products, isLoading, quantities, onQuantityChange, onAddToCart }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Leaf className="w-16 h-16 mb-4 text-emerald-200" />
        <p className="text-lg">No products available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities[product.id] || 0}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}