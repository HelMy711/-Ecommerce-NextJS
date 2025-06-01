"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  role: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  cart: { _id: string; productId: string; quantity: number; size: string }[];
  wishlist: { productId: string }[];
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
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
    if (!token) {
      alert("Admin token is missing.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${paramsData.id}`, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setLoading(false);
      });
  }, [paramsData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin token is missing.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${paramsData?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        alert("User updated successfully!");
        window.location.href = "/mang/users";
      } else {
        const errorData = await res.json();
        alert(`Error updating user: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert("Error updating user: " + errorMessage);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>User not found.</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">User Details</h1>
      <div className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Address:</strong> {user.address || "No address provided"}</p>
          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Cart</h2>
          <ul className="list-disc pl-5">
            {user.cart.map((item) => (
              <li key={item._id}>
                Product ID: {item.productId}, Quantity: {item.quantity}, Size: {item.size}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Wishlist</h2>
          <ul className="list-disc pl-5">
            {user.wishlist.map((item) => (
              <li key={item.productId}>Product ID: {item.productId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}