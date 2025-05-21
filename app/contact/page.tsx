export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />
        <textarea
          placeholder="Your Message"
          rows={5}
          className="w-full border rounded px-4 py-2 dark:bg-gray-800 dark:text-white"
        />
        <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">
          Send Message
        </button>
      </form>
    </main>
  );
}
