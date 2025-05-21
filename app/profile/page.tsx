export default function ProfilePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white dark:bg-gray-900 p-6 rounded shadow">
        <p className="text-gray-700 dark:text-gray-300 mb-2">Name: Helmy</p>
        <p className="text-gray-700 dark:text-gray-300 mb-2">Email: helmy@example.com</p>
        <p className="text-gray-700 dark:text-gray-300">Orders: 0</p>
      </div>
    </main>
  );
}
