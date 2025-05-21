import Link from 'next/link';

export default function ProductsPage() {
  return (
    <main className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <Link
            key={id}
            href={`/product/${id}`}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="h-40 bg-gray-100 rounded mb-4" />
            <h2 className="font-semibold text-lg">Product {id}</h2>
            <p className="text-sm text-gray-500">Short description...</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
