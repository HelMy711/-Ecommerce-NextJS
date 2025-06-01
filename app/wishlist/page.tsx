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

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/users/profile`, {
      headers: { 'x-auth-token': token },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.wishlist)) {
          const ids = data.wishlist
            .map((item: { productId?: string }) => item.productId)
            .filter(Boolean);
          setWishlist(ids);
        } else {
          setWishlist([]);
        }
      })
      .catch(() => setWishlist([]));
  }, []);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      wishlist.map((code) =>
        fetch(`${API_URL}/products/c/${code}`)
          .then((res) => res.json())
          .catch(() => null)
      )
    ).then((prods) => {
      setProducts(prods.filter((p): p is Product => !!p && !!p._id));
      setLoading(false);
    });
  }, [wishlist]);

  const removeFromWishlist = async (productCode: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    await fetch(`${API_URL}/users/wishlist/${productCode}`, {
      method: 'DELETE',
      headers: { 'x-auth-token': token },
    });
    setWishlist((prev) => prev.filter((code) => code !== productCode));
    setProducts((prev) => prev.filter((p) => p.productCode !== productCode));
  };

  if (loading)
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <p>Loading...</p>
      </main>
    );

  if (error)
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        <p className="text-red-600">{error}</p>
      </main>
    );

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Your wishlist is empty.
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="group relative p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700
                transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Link href={`/product/${product.slug}`}>
                <div className="cursor-pointer">
                  <div className="flex items-center justify-center rounded-lg mb-4 h-48 shadow-sm bg-transparent">
                    <img
                      src={product.images[0] || ''}
                      alt={product.name}
                      className="object-contain h-40 w-full rounded"
                    />
                  </div>
                  <h2 className="font-bold text-xl mb-1">{product.name}</h2>
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
                className="absolute bottom-5 right-5 flex gap-3
                  opacity-100 visible
                  transition-opacity duration-300"
              >
                <button
                  className="p-2 rounded-full shadow-md bg-[#222] text-[#ededed] dark:bg-[#b5f1b1] dark:text-[#222] hover:bg-[#a0e6a0] dark:hover:bg-[#444] transition"
                  onClick={() => removeFromWishlist(product.productCode)}
                  aria-label="Remove from Wishlist"
                  title="Remove from Wishlist"
                >
                  <FaHeart size={18} className="fill-current text-red-500" />
                </button>
                <button
                  className="p-2 rounded-full shadow-md 
                    bg-[#b5f1b1] text-[#222] hover:bg-[#a0e6a0]
                    dark:bg-[#222] dark:text-[#ededed] dark:hover:bg-[#444] transition"
                  onClick={() => console.log(`Add to Cart: ${product._id}`)}
                  aria-label="Add to Cart"
                >
                  <FaShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
