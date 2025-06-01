"use client";

import { useEffect, useState } from "react";

interface Size {
  size: string;
  available: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        console.log("Fetched products:", data);

        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Expected an array of products, got:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => window.location.href = '/mang/products/add'}
      >
        Add New Product
      </button>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow cursor-pointer"
              onClick={() => window.location.href = `/mang/products/${product._id}`}
            >
              <div className="w-full h-48 mb-2 overflow-hidden rounded">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-2 font-bold">EGP {product.price}</p>
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="text-sm">Available: {product.isAvailable ? "Yes" : "No"}</p>
              <button
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("Admin token is missing.");
                    return;
                  }
                  if (confirm('Are you sure you want to delete this product?')) {
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product/${product._id}`, {
                        method: 'DELETE',
                        headers: {
                          'x-auth-token': token,
                        },
                      });

                      const contentType = res.headers.get("Content-Type");
                      const responseText = await res.text();
                      console.log("API Response:", responseText);

                      if (res.ok) {
                        if (contentType && contentType.includes("application/json")) {
                          const responseData = JSON.parse(responseText);
                          alert(responseData.message || "Product deleted successfully!");
                        } else {
                          alert("Product deleted successfully, but response format is not JSON.");
                        }
                        setProducts(products.filter(p => p._id !== product._id));
                      } else {
                        if (contentType && contentType.includes("application/json")) {
                          const errorData = JSON.parse(responseText);
                          alert(`Error deleting product: ${errorData.message || "Unknown error"}`);
                        } else {
                          alert("Error deleting product: Unexpected response format");
                        }
                      }
                    } catch (error) {
                      const errorMessage = error instanceof Error ? error.message : "Unknown error";
                      alert("Error deleting product: " + errorMessage);
                    }
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
