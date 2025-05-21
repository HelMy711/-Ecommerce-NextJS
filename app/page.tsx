import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-purple-950 to-black text-white min-h-screen flex flex-col justify-center items-center px-4">
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        Discover <span className="text-purple-400">Premium</span> Products
      </h1>
      <p className="text-gray-300 text-lg max-w-xl text-center mb-8">
        Join thousands of users enjoying the fastest and most reliable online shopping experience.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="bg-white text-purple-800 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
        >
          Explore Products
        </Link>
        <Link
          href="/compare"
          className="border border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-purple-900 transition"
        >
          Compare Now
        </Link>
      </div>
    </main>
  );
}
