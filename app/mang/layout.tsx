'use client';

import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/not-found";
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/auth/isadmin`, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/not-found";
        }
      })
      .catch(() => {
        window.location.href = "/not-found";
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <nav className="bg-gray-800 py-4 px-8 flex gap-8 text-white font-bold">
        <a href="/mang/products" className="hover:underline">Manage Products</a>
        <a href="/mang/orders" className="hover:underline">Manage Orders</a>
        <a href="/mang/promos" className="hover:underline">Manage Promo Codes</a>
      </nav> */}
      <main className="max-w-6xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}