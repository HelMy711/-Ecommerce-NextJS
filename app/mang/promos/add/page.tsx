"use client";

import { useState } from "react";

interface Promo {
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  minOrderValue: number;
}

export default function AddPromo() {
  const [promo, setPromo] = useState<Promo>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    expiryDate: "",
    minOrderValue: 0,
  });

  const handleAddPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Admin token is missing.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(promo),
      });

      if (res.ok) {
        alert("Promo code added successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error adding promo code: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error adding promo code: " + errorMessage);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Promo Code</h1>
      <form onSubmit={handleAddPromo}>
        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">Promo Code</label>
          <input
            type="text"
            id="code"
            name="code"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={promo.code}
            onChange={(e) => setPromo({ ...promo, code: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
          <select
            id="discountType"
            name="discountType"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={promo.discountType}
            onChange={(e) => setPromo({ ...promo, discountType: e.target.value })}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">Discount Value</label>
          <input
            type="number"
            id="discountValue"
            name="discountValue"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={promo.discountValue}
            onChange={(e) => setPromo({ ...promo, discountValue: parseFloat(e.target.value) })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={promo.expiryDate}
            onChange={(e) => setPromo({ ...promo, expiryDate: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="minOrderValue" className="block text-sm font-medium text-gray-700">Minimum Order Value</label>
          <input
            type="number"
            id="minOrderValue"
            name="minOrderValue"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            value={promo.minOrderValue}
            onChange={(e) => setPromo({ ...promo, minOrderValue: parseFloat(e.target.value) })}
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Add Promo Code</button>
      </form>
    </div>
  );
}