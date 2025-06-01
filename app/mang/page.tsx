export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 py-4 px-8 flex flex-col gap-4 text-white font-bold">
        <a href="/mang/products" className="hover:underline">Manage Products</a>
        <a href="/mang/orders" className="hover:underline">Manage Orders</a>
        <a href="/mang/promos" className="hover:underline">Manage Promo Codes</a>
        <a href="/mang/users" className="hover:underline">Manage Users</a>
      </nav>
      <main className="max-w-6xl mx-auto py-8 px-4">{children}</main>
    </div>
  );
}