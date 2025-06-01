'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/admin/orders`, {
      headers: { 'x-auth-token': token || '' },
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>
      {loading ? <p>Loading...</p> : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.userid}</td>
                <td>{o.status}</td>
                <td>
                  <a href={`/mang/orders/${o._id}`} className="text-blue-600 underline">Edit</a>
                </td>
                <td>
                  <button
                    className="text-red-600"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        alert("Admin token is missing.");
                        return;
                      }

                      if (confirm("Are you sure you want to delete this order?")) {
                        try {
                          const res = await fetch(`${API_URL}/admin/orders/${o._id}`, {
                            method: "DELETE",
                            headers: {
                              "x-auth-token": token,
                            },
                          });

                          if (res.ok) {
                            alert("Order deleted successfully!");
                            setOrders(orders.filter((order) => order._id !== o._id));
                          } else {
                            const errorData = await res.json();
                            alert(`Error deleting order: ${errorData.message || "Unknown error"}`);
                          }
                        } catch (error) {
                          const errorMessage = error instanceof Error ? error.message : "Unknown error";
                          alert("Error deleting order: " + errorMessage);
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