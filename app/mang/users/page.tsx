"use client";

import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  phoneNumber: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Admin token is missing.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        "x-auth-token": token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          console.error("Unexpected response format:", data);
          setUsers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery) ||
      user._id.includes(searchQuery)
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <input
        type="text"
        placeholder="Search by name, phone number, or ID"
        className="mb-4 px-4 py-2 border rounded-md w-full"
        value={searchQuery}
        onChange={handleSearch}
      />
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.phoneNumber}</td>
              <td className="border border-gray-300 px-4 py-2">
                <a
                  href={`/mang/users/${user._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
                >
                  Edit
                </a>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      alert("Admin token is missing.");
                      return;
                    }

                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${user._id}`, {
                      method: "DELETE",
                      headers: {
                        "x-auth-token": token,
                      },
                    })
                      .then((res) => {
                        if (res.ok) {
                          alert("User deleted successfully!");
                          setUsers((prev) => prev.filter((u) => u._id !== user._id));
                        } else {
                          alert("Failed to delete user.");
                        }
                      })
                      .catch((err) => {
                        console.error("Error deleting user:", err);
                      });
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}