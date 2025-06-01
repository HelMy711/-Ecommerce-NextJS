'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CartItem {
  _id: string; // لازم نعرف الـ itemId عشان نستخدمه في التحديث والحذف
  productId: string;
  size: string;
  quantity: number;
}

interface ProfileData {
  cart: CartItem[];
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ item: CartItem; product: Product }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch cart');
        }
        return res.json();
      })
      .then((data: ProfileData) => {
        const items = Array.isArray(data.cart) ? data.cart : [];
        setCartItems(items);
      })
      .catch((err) => {
        localStorage.removeItem("token");
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    Promise.all(
      cartItems.map((item) =>
        fetch(`${API_URL}/products/c/${item.productId}`)
          .then((res) => res.json())
          .then((product) => ({ item, product }))
          .catch(() => null)
      )
    ).then((res) => {
      const valid = res.filter((p): p is { item: CartItem; product: Product } => !!p && !!p.product?._id);
      setProducts(valid);
      setLoading(false);
    });
  }, [cartItems]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return; // لا تقبل أقل من 1

    try {
      const res = await fetch(`${API_URL}/users/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) throw new Error('Failed to update quantity');

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      alert('Error updating quantity');
      console.error(err);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) return;

    try {
      const res = await fetch(`${API_URL}/users/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token || '',
        },
      });
      if (!res.ok) {
        localStorage.removeItem("token");
        throw new Error('Failed to remove item');
      }

      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      alert('Error removing item');
      console.error(err);
    }
  };

  const total = products.reduce(
    (sum, { item, product }) => sum + product.price * item.quantity,
    0
  );

  if (loading)
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-gray-100 p-6 rounded">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-gray-100 p-6 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {products.length === 0 ? (
        <div className="bg-gray-100 p-6 rounded">
          <p className="text-gray-600">Your cart is currently empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {products.map(({ item, product }, idx) => (
              <div
                key={product._id + '-' + idx}
                className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded shadow"
              >
                <img
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  className="h-16 w-16 object-contain rounded"
                />
                <div className="flex-1">
                  <Link href={`/product/${product.slug}`} className="font-semibold hover:underline">
                    {product.name}
                  </Link>
                  <div className="text-gray-600 dark:text-gray-300">
                    Size: <span className="font-medium">{item.size}</span>
                  </div>

                  <div className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    Quantity:
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                      className="border px-2 py-1 w-20 rounded"
                    />
                  </div>

                  <div className="text-gray-700 dark:text-gray-100 font-bold">
                    Total: {product.price * item.quantity} EGP
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:text-red-800 font-bold text-xl px-3 py-1 rounded"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Total + Checkout */}
          <div className="mt-6 p-4 bg-gray-100 rounded shadow text-right">
            <div className="text-lg font-semibold mb-2">Cart Total: {total} EGP</div>
            <button
              onClick={() => alert('Proceeding to checkout...')}
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}
