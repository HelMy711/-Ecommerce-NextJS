"use client";

import { useState } from "react";

interface Product {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  sizes: { size: string; available: boolean }[];
  images: string[];
  discount: number;
  isAvailable: boolean;
  productCode: string;
}

export default function AddProduct() {
  const [product, setProduct] = useState<Product>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    category: "",
    sizes: [],
    images: [],
    discount: 0,
    isAvailable: true,
    productCode: "",
  });
  const [newSize, setNewSize] = useState<string>("");
  const [newImage, setNewImage] = useState<string>("");

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Admin token is missing.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        alert("Product added successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error adding product: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error adding product: " + errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleAddProduct}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const name = e.target.value;
              const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
              setProduct({ ...product, name, slug });
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.slug}
            onChange={(e) => setProduct({ ...product, slug: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">Sizes</label>
          <div className="mt-1">
            {product.sizes.map((size, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="mr-2">{size.size}</span>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md ${size.available ? "bg-green-500 text-white" : "bg-gray-300 text-black"}`}
                  onClick={() => {
                    const updatedSizes = product.sizes.map((s, i) =>
                      i === index ? { ...s, available: !s.available } : s
                    );
                    setProduct({ ...product, sizes: updatedSizes });
                  }}
                >
                  {size.available ? "Available" : "Not Available"}
                </button>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => {
                    const updatedSizes = product.sizes.filter((_, i) => i !== index);
                    setProduct({ ...product, sizes: updatedSizes });
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Add new size"
                className="mr-2 px-4 py-2 border rounded-md"
                value={newSize}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSize(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  if (newSize.trim()) {
                    const updatedSizes = [...product.sizes, { size: newSize.trim(), available: true }];
                    setProduct({ ...product, sizes: updatedSizes });
                    setNewSize("");
                  }
                }}
              >
                Add Size
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
          <div className="mt-2">
            {product.images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <img src={image} alt={`Image ${index + 1}`} className="w-20 h-20 object-cover mr-2" />
                <span className="text-sm text-gray-600 mr-2 break-words">{image}</span>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => {
                    const updatedImages = product.images.filter((_, i) => i !== index);
                    setProduct({ ...product, images: updatedImages });
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Add new image URL"
                className="mr-2 px-4 py-2 border rounded-md break-words"
                value={newImage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewImage(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  if (newImage.trim()) {
                    const updatedImages = [...product.images, newImage.trim()];
                    setProduct({ ...product, images: updatedImages });
                    setNewImage("");
                  }
                }}
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount</label>
          <input
            type="number"
            id="discount"
            name="discount"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.discount}
            onChange={(e) => setProduct({ ...product, discount: parseFloat(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="isAvailable" className="block text-sm font-medium text-gray-700">Is Available</label>
          <select
            id="isAvailable"
            name="isAvailable"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.isAvailable ? "true" : "false"}
            onChange={(e) => setProduct({ ...product, isAvailable: e.target.value === "true" })}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="productCode" className="block text-sm font-medium text-gray-700">Product Code</label>
          <input
            type="text"
            id="productCode"
            name="productCode"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={product.productCode}
            onChange={(e) => setProduct({ ...product, productCode: e.target.value })}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Product</button>
      </form>
    </div>
  );
}