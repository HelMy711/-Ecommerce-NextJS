'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
  name: string;
  phoneNumber: string;
  orders: number;
  address?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/users/profile`, {
      headers: {
        'x-auth-token': token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch profile');
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading)
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p>Loading...</p>
      </main>
    );

  if (error)
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-red-600">{error}</p>
      </main>
    );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
        <p className="text-gray-700 dark:text-gray-300 mb-2">Name: {profile?.name}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Phone Number: {profile?.phoneNumber}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Orders: {profile?.orders}</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Address: {profile?.address || 'No address provided'}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Logout
      </button>
    </main>
  );
}
