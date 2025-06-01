"use client";

import { useEffect, useState } from "react";

interface Promo {
  code: string;
  discountType: string;
  discountValue: number;
  expiryDate: string;
  minOrderValue: number;
}

export default function EditPromo({ params }: { params: { id: string } }) {
  const [promo, setPromo] = useState<Promo | null>(null);
  const [loading, setLoading] = useState(true);
  const[id, setId] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/promo/${params.id}`, {
      headers: { "x-auth-token": token || "" },
    })
      .then((res) => res.json())
      .then((data) => {
        setPromo(data.data);
        setId(data.data._id);
        setLoading(false);
      });
  }, [params.id]);

  const handleUpdatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Admin token is missing.");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(promo),
      });

      if (res.ok) {
        alert("Promo code updated successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error updating promo code: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error updating promo code: " + errorMessage);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!promo) return <p>Promo code not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Promo Code</h1>
      <form onSubmit={handleUpdatePromo}>
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
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Update Promo Code</button>
      </form>
    </div>
  );
}