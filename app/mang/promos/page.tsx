'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPromos() {
  const [promos, setPromos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/admin/promos`, {
      headers: { 'x-auth-token': token || '' },
    })
      .then(res => res.json())
      .then(data => {
          console.log("API Response:", data); 
          if (data && Array.isArray(data.promoCodes)) {
            setPromos(data.promoCodes);
          } else {
            console.error("Expected an array of promoCodes, got:", data);
            setPromos([]);
          }
          setLoading(false);
        });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Promo Codes</h1>
      <a href="/admin/promos/add" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block">Add Promo Code</a>
      {loading ? <p>Loading...</p> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((p) => (
              <tr key={p._id}>
                <td>{p.code}</td>
                <td>{p.discountValue} {p.discountType === 'percentage' ? '%' : 'EGP'}</td>
                <td><a href={`/mang/promos/${p.code}`} className="text-blue-600 underline">Edit</a></td>
                <td>
                  <button
                    className="text-red-600"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        alert("Admin token is missing.");
                        return;
                      }

                      if (confirm("Are you sure you want to delete this promo code?")) {
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/promo/${p._id}`, {
                            method: "DELETE",
                            headers: {
                              "x-auth-token": token,
                            },
                          });

                          if (res.ok) {
                            alert("Promo code deleted successfully!");
                            setPromos(promos.filter((promo) => promo._id !== p._id));
                          } else {
                            const errorData = await res.json();
                            alert(`Error deleting promo code: ${errorData.message || "Unknown error"}`);
                          }
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : "Unknown error";
                          alert("Error deleting promo code: " + errorMessage);
                        }
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}