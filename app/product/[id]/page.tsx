import { notFound } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default function ProductDetailsPage({ params }: Props) {
  const { id } = params;

  // Fake check for now
  if (!id) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-100 h-80 rounded" />
        <div>
          <h1 className="text-3xl font-bold mb-2">Product #{id}</h1>
          <p className="text-gray-600 mb-4">
            This is a detailed description of the product. You can add price, rating, etc.
          </p>
          <button className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
