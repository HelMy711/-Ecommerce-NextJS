export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-5xl font-bold text-purple-700">404</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition"
      >
        Back to Home
      </a>
    </main>
  );
}
