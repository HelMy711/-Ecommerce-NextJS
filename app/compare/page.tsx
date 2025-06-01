"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  _id: string;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  sizes: { size: string; available: boolean; _id: string }[];
  images: string[];
  discount: number;
  isAvailable: boolean;
}

const ComparePage = () => {
  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const p1 = localStorage.getItem("p1");
    const p2 = localStorage.getItem("p2");

    if (p1 && p2) {
      fetch(`${API_URL}/products/slug/${p1}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Error fetching product 1`);
          return res.json();
        })
        .then((data) => setProduct1(data))
        .catch((err) => setError(err.message));

      fetch(`${API_URL}/products/slug/${p2}`)
        .then((res) => {
          if (!res.ok) throw new Error(`Error fetching product 2`);
          return res.json();
        })
        .then((data) => setProduct2(data))
        .catch((err) => setError(err.message));
    } else {
      setError("Product slugs are missing in localStorage.");
    }
  }, []);

  const clearComparison = () => {
    localStorage.removeItem("p1");
    localStorage.removeItem("p2");
    setProduct1(null);
    setProduct2(null);
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!product1 || !product2) return <div className="text-center">Loading...</div>;

  const priceAfterDiscount = (price: number, discount: number) =>
    (price - (price * discount) / 100).toFixed(2);

  return (
    <div className="compare-page px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Compare Products</h1>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {[product1, product2].map((product) => (
          <Link
            href={`/product/${product.slug}`}
            key={product._id}
            className="block p-4 rounded-md shadow-md border border-gray-300"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
          </Link>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border font-bold">Feature</th>
              <th className="p-3 border">{product1.name}</th>
              <th className="p-3 border">{product2.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border">Price (after discount)</td>
              <td className="p-3 border">${priceAfterDiscount(product1.price, product1.discount)}</td>
              <td className="p-3 border">${priceAfterDiscount(product2.price, product2.discount)}</td>
            </tr>

            <tr>
              <td className="p-3 border">Discount</td>
              <td className="p-3 border">{product1.discount}%</td>
              <td className="p-3 border">{product2.discount}%</td>
            </tr>
        
            <tr>
              <td className="p-3 border">Description</td>
              <td className="p-3 border">{product1.description}</td>
              <td className="p-3 border">{product2.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={clearComparison}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Comparison
        </button>
      </div>
    </div>
  );
};

export default ComparePage;
