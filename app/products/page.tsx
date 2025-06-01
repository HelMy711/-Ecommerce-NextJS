'use client';

import Link from 'next/link';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Size {
  size: string;
  available: boolean;
  _id: string;
}

interface Product {
  _id: string;
  productCode: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  sizes: Size[];
  images: string[];
  discount: number;
  isAvailable: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_URL}/users/profile`, {
      headers: { 'x-auth-token': token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.wishlist)) {
          setWishlist(data.wishlist.map((item: { productId: string }) => item.productId));
        }
      });
  }, []);

  const toggleWishlist = async (productCode: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to use wishlist.');
      return;
    }
    if (wishlist.includes(productCode)) {
      await fetch(`${API_URL}/users/wishlist/${productCode}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      setWishlist((prev) => prev.filter((code) => code !== productCode));
    } else {
      await fetch(`${API_URL}/users/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ productId: productCode }),
      });
      setWishlist((prev) => [...prev, productCode]);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen py-12 px-6 transition-colors duration-500">
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
          Loading Products...
        </h1>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen py-12 px-6 transition-colors duration-500">
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
          Error: {error}
        </h1>
      </main>
    );

  return (
    <main className="min-h-screen py-12 px-6 transition-colors duration-500 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">
        All Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {products.map((product) => {
          const isWishlisted = wishlist.includes(product.productCode);
          return (
            <div
              key={product._id}
              className="group relative p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="cursor-pointer">
               
                  <div className="relative h-56 rounded-lg mb-4 overflow-hidden">
                
                    <img
                      src={product.images[0] || ''}
                      alt={product.name}
                      className="absolute top-0 left-0 w-full h-full object-cover filter blur-lg scale-110 z-0"
                    />
             
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      <img
                        src={product.images[0] || ''}
                        alt={product.name}
                        className="object-contain max-h-full max-w-full"
                      />
                    </div>
                  </div>

                  <h2 className="font-bold text-xl mb-1 text-black dark:text-white">
                    {product.name}
                  </h2>
                  <div className="text-left mt-2">
                    {product.discount > 0 && (
                      <div className="text-sm line-through opacity-60 text-gray-500 dark:text-gray-400">
                        {product.price.toFixed(2)} EGP
                      </div>
                    )}
                    <div className="text-lg font-semibold text-green-800 dark:text-green-300">
                      {(product.price * (1 - product.discount / 100)).toFixed(2)} EGP
                    </div>
                  </div>
                </div>
              </Link>

              <div
                className={`absolute bottom-5 right-5 flex gap-3 
                  opacity-100 visible 
                  sm:opacity-0 sm:invisible 
                  sm:group-hover:opacity-100 sm:group-hover:visible
                  transition-opacity duration-300`}
              >
                <button
                  className={`p-2 rounded-full shadow-md transition
                    ${isWishlisted
                      ? 'bg-[#222] text-[#ededed] dark:bg-[#b5f1b1] dark:text-[#222]'
                      : 'bg-[#b5f1b1] text-[#222] dark:bg-[#222] dark:text-[#ededed]'}
                    hover:bg-[#a0e6a0] dark:hover:bg-[#444]`}
                  onClick={() => toggleWishlist(product.productCode)}
                  aria-label="Add to Wishlist"
                >
                  <FaHeart
                    size={18}
                    className={isWishlisted ? 'fill-current text-red-500' : ''}
                  />
                </button>
                <Link href={`/product/${product.slug}`}>
                  <button
                    className="p-2 rounded-full shadow-md 
                      bg-[#b5f1b1] text-[#222] hover:bg-[#a0e6a0]
                      dark:bg-[#222] dark:text-[#ededed] dark:hover:bg-[#444] transition"
                    aria-label="Add to Cart"
                  >
                    <FaShoppingCart size={18} />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
