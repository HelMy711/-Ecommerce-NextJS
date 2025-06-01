"use client";

import React, { useEffect, useState } from "react";

interface Order {
  _id: string;
  userid: string;
  items: {
    productId: string;
    quantity: number;
    size: string;
    _id: string;
    productDetails?: {
      images: string[];
      name: string;
      sizes: { size: string; available: boolean; _id: string }[];
    };
  }[];
  totalAmount: number;
  status: string;
  promoCode: string;
  PromoCodeActive: boolean;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditOrder({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paramsData, setParamsData] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setParamsData(resolvedParams);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!paramsData) return;

    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${paramsData.id}`, {
      headers: { "x-auth-token": token || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [paramsData]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramsData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Admin token is missing.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${paramsData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        alert("Order updated successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error updating order: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error updating order: " + errorMessage);
    }
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!order) return;

      const updatedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/product/${item.productId}`);
            const productDetails = await res.json();
            return { ...item, productDetails };
          } catch (error) {
            console.error("Error fetching product details:", error);
            return item;
          }
        })
      );

      setOrder((prev) => prev ? { ...prev, items: updatedItems } : null);
    };

    fetchProductDetails();
  }, [order?.items.length]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Order</h1>
      <form onSubmit={handleUpdateOrder}>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Order Status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            name="address"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.address}
            onChange={(e) => setOrder({ ...order, address: e.target.value })}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="promoCode" className="block text-sm font-medium text-gray-700">Promo Code</label>
          <input
            type="text"
            id="promoCode"
            name="promoCode"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.promoCode}
            onChange={(e) => setOrder({ ...order, promoCode: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.totalAmount}
            onChange={(e) => setOrder({ ...order, totalAmount: parseFloat(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Items</label>
          {order.items.map((item, index) => (
            <div key={item._id} className="flex items-center mb-4">
              <div className="mr-4">
                <img
                  src={item.productDetails?.images[0] || undefined}
                  alt={item.productDetails?.name || "Product Image"}
                  className="w-16 h-16"
                />
                <p className="text-sm font-medium">{item.productDetails?.name || "Product Name"}</p>
              </div>
              <div>
                <label htmlFor={`size-${index}`} className="block text-sm font-medium text-gray-700">Size</label>
                <select
                  id={`size-${index}`}
                  name={`size-${index}`}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={item.size}
                  onChange={(e) => {
                    const updatedItems = [...order.items];
                    updatedItems[index].size = e.target.value;
                    setOrder({ ...order, items: updatedItems });
                  }}
                >
                  {item.productDetails?.sizes.map((sizeOption: any) => (
                    <option key={sizeOption._id} value={sizeOption.size}>{sizeOption.size}</option>
                  ))}
                </select>
                <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  id={`quantity-${index}`}
                  name={`quantity-${index}`}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  value={item.quantity}
                  onChange={(e) => {
                    const updatedItems = [...order.items];
                    updatedItems[index].quantity = parseInt(e.target.value, 10);
                    setOrder({ ...order, items: updatedItems });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Update Order</button>
      </form>
    </div>
  );
}
