'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Call your login API here
    console.log('Login:', { email, password });
  };

  return (
    <main className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Login to Your Account</h1>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded shadow space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded dark:bg-gray-800 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
        >
          Login
        </button>
      </form>
    </main>
  );
}
