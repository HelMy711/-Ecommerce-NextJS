export default function WishlistPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {/* Replace with real wishlist data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="border p-4 rounded bg-gray-50">
          <div className="h-32 bg-gray-200 rounded mb-4" />
          <h2 className="font-semibold">Sample Product</h2>
          <p className="text-sm text-gray-500">Wishlist item details</p>
        </div>
      </div>
    </main>
  );
}
