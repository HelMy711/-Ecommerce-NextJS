'use client';

import { notFound, useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [zoomed, setZoomed] = useState(false);

  // States for advanced zoom & pan
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/products/slug/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setProduct(data);
        } else {
          setProduct(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setProduct(null);
        setLoading(false);
      });
  }, [slug]);

  const handleAddToCart = async () => {
    if (!selectedSize || !product) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/users/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({
          productId: product.productCode,
          quantity,
          size: selectedSize,
        }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      alert('Added to cart successfully ✅');
    } catch (err) {
      alert('Error adding to cart ❌');
      console.error(err);
    }
  };

  const addToCompare = (slug: string) => {
    const p1 = localStorage.getItem('p1');
    const p2 = localStorage.getItem('p2');

    if (!p1) {
      localStorage.setItem('p1', slug);
      alert('Product added to comparison list.')
    } else if (!p2) {
      localStorage.setItem('p2', slug);
      alert('Product added to comparison list.')
    } else {
      
    }
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    let newScale = scale - e.deltaY * 0.001;
    if (newScale < 1) newScale = 1;
    if (newScale > 5) newScale = 5;
    setScale(newScale);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    e.preventDefault();
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setTranslate((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = false;
  };

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    dragging.current = false;
  };

  if (loading)
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <p>Loading...</p>
      </main>
    );

  if (!product) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative bg-gray-100 h-80 rounded flex items-center justify-center cursor-pointer">
          {product.images && product.images[0] ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-contain h-72 w-full rounded"
                onClick={() => setZoomed(true)}
              />
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg select-none">
                  -{product.discount}%
                </div>
              )}
            </>
          ) : (
            <span>No Image</span>
          )}

          {/* Zoomed Image Overlay with pan & zoom */}
          {zoomed && (
            <div
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
              onClick={() => {
                setZoomed(false);
                setScale(1);
                setTranslate({ x: 0, y: 0 });
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()} // Prevent close on image container click
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                style={{
                  cursor: scale > 1 ? 'grab' : 'auto',
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transition: dragging.current ? 'none' : 'transform 0.3s ease',
                }}
                className="max-h-[90vh] max-w-[90vw] rounded shadow-lg overflow-hidden"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-contain max-h-[90vh] max-w-[90vw] select-none"
                  draggable={false}
                />
              </div>
              <button
                onClick={() => {
                  setZoomed(false);
                  setScale(1);
                  setTranslate({ x: 0, y: 0 });
                }}
                className="absolute top-5 right-5 text-white bg-gray-700 rounded-full px-3 py-1 text-lg font-bold hover:bg-gray-900"
              >
                &times;
              </button>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="mb-2 font-semibold">
            Price:{' '}
            {product.discount > 0 ? (
              <>
                <span className="line-through text-gray-500 mr-2">{product.price} EGP</span>
                <span className="text-purple-700">
                  {(product.price * (1 - product.discount / 100)).toFixed(2)} EGP
                </span>
              </>
            ) : (
              <span className="text-purple-700">{product.price} EGP</span>
            )}
          </p>
          <p className="mb-2">Category: {product.category}</p>

          {/* Sizes */}
          <div className="mb-4">
            <span className="font-semibold">Sizes: </span>
            {product.sizes.map((size) => {
              const isSelected = selectedSize === size.size;
              return (
                <button
                  key={size._id}
                  disabled={!size.available}
                  onClick={() => setSelectedSize(size.size)}
                  className={`inline-block px-3 py-1 mr-2 mt-2 rounded border transition ${
                    size.available
                      ? isSelected
                        ? 'bg-purple-700 text-white border-purple-700'
                        : 'border-green-500 text-green-700 hover:bg-green-100'
                      : 'border-gray-400 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {size.size}
                </button>
              );
            })}
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="font-semibold mr-2">Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-2 py-1 w-20 rounded"
            />
          </div>

          <button
            disabled={!selectedSize}
            onClick={handleAddToCart}
            className={`w-full py-2 rounded text-white font-bold transition ${
              selectedSize ? 'bg-purple-700 hover:bg-purple-900' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>

          {/* Add to Compare Button */}
          <button
            onClick={() => addToCompare(product.slug)}
            className="w-full py-2 mt-4 rounded text-white bg-blue-600 font-bold transition hover:bg-blue-700"
          >
            Add to Compare
          </button>
        </div>
      </div>
    </main>
  );
}
