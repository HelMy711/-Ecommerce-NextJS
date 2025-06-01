"use client";

import { useState } from "react";

interface Order {
  orderId: string;
  items: string[];
  address: string;
  status: string;
}

export default function AddOrder() {
  const [order, setOrder] = useState<Order>({
    orderId: "",
    items: [],
    address: "",
    status: "Pending",
  });
  const [newItem, setNewItem] = useState<string>("");

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Admin token is missing.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        alert("Order added successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error adding order: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error adding order: " + errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Order</h1>
      <form onSubmit={handleAddOrder}>
        <div className="mb-4">
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700">Order ID</label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.orderId}
            onChange={(e) => setOrder({ ...order, orderId: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="items" className="block text-sm font-medium text-gray-700">Items</label>
          <div className="mt-1">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="mr-2">{item}</span>
                <button
                  type="button"
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => {
                    const updatedItems = order.items.filter((_, i) => i !== index);
                    setOrder({ ...order, items: updatedItems });
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Add new item"
                className="mr-2 px-4 py-2 border rounded-md"
                value={newItem}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewItem(e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                onClick={() => {
                  if (newItem.trim()) {
                    const updatedItems = [...order.items, newItem.trim()];
                    setOrder({ ...order, items: updatedItems });
                    setNewItem("");
                  }
                }}
              >
                Add Item
              </button>
            </div>
          </div>
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={order.status}
            onChange={(e) => setOrder({ ...order, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Order</button>
      </form>
    </div>
  );
}
